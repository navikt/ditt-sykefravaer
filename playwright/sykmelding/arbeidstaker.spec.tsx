import { expect, test } from '@playwright/test'

import { getRadioInGroup } from '../utils/test-utils'
import {
    bekreftNarmesteleder,
    filloutArbeidstaker,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    sendSykmelding,
    velgArbeidssituasjon,
} from '../utils/user-actions'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-parse')

test.describe('Arbeidssituasjon - Arbeidstaker', () => {
    test.describe('normal situation', () => {
        test('burde kunne printe ut info om sykmeldingen, tester tekst', async ({ page }) => {
            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()

            const downloadPath = await page
                .getByRole('button', { name: 'Åpne PDF av sykmeldingen' })
                .getAttribute('href')
            expect(downloadPath).toBeTruthy()

            if (typeof downloadPath !== 'string') {
                throw new Error('Download path is not a string')
            }

            const baseURL = process.env.BASE_URL || new URL(page.url()).origin
            const downloadUrl = new URL(downloadPath, baseURL).toString()

            const [download] = await Promise.all([
                page.waitForEvent('download'),
                page.evaluate((url) => {
                    const a = document.createElement('a')
                    a.href = url
                    a.download = ''
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                }, downloadUrl),
            ])

            expect(download.suggestedFilename()).toMatch(/\.pdf$/)

            const stream = await download.createReadStream()
            const chunks: Buffer[] = []
            for await (const chunk of stream) {
                chunks.push(chunk as Buffer)
            }
            const buffer = Buffer.concat(chunks)

            const data = await pdf(buffer)
            expect(data.text).toContain('Opplysninger fra sykmeldingen')
            expect(data.text).toContain('Sendt til oss 8. januar 2025')
            expect(data.text).toContain('Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet')
        })

        test('should be able to submit form with active arbeidsgiver and nærmeste leder', async ({ page }) => {
            await gotoScenario('normal')(page)
            await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)

            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Pontypandy Fire Service i perioden/ },
                { name: 'Nei' },
            ).click()

            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                arbeidsgiver: 'Pontypandy Fire Service',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                egenmeldingsdager: {
                    arbeidsgiver: 'Pontypandy Fire Service',
                    svar: 'Nei',
                },
            })(page)
        })

        test('should be able to submit form with active arbeidsgiver and chosing "No" on correct narmeste leder', async ({
            page,
        }) => {
            await gotoScenario('normal')(page)
            await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele', 'Nei')(page)

            await expect(
                page.getByText('Siden du sier det er feil, ber vi arbeidsgiveren din om å gi oss riktig navn.'),
            ).toBeVisible()

            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Pontypandy Fire Service i perioden/ },
                { name: 'Nei' },
            ).click()

            await expect(page.getByRole('region', { name: 'Se hva som sendes til jobben din' })).toBeVisible()
            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                arbeidsgiver: '110110110',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Nei',
                },
                egenmeldingsdager: {
                    arbeidsgiver: 'Pontypandy Fire Service',
                    svar: 'Nei',
                },
            })(page)
        })

        test('should be able to submit form with inactive arbeidsgiver', async ({ page }) => {
            await gotoScenario('normal', {
                antallArbeidsgivere: 4,
            })(page)

            await filloutArbeidstaker(/Mt.frank Storbyuniversitet Studiestedettilnoenveldigviktige Pekepinnstredet/)(
                page,
            )

            await getRadioInGroup(page)(
                {
                    name: /Er du syk fra flere arbeidsforhold i denne perioden/,
                },
                { name: 'Nei' },
            ).click()

            // Should ask about egenmeldingsdager even though arbeidsgiver is inactive
            await getRadioInGroup(page)(
                {
                    name: /Brukte du egenmelding hos Mt.frank Storbyuniversitet Studiestedettilnoenveldigviktige Pekepinnstredet i perioden/,
                },
                { name: 'Nei' },
            ).click()

            await expect(page.getByRole('region', { name: 'Se hva som sendes til jobben din' })).toBeVisible()
            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Mt.frank Storbyuniversitet Studiestedettilnoenveldigviktige Pekepinnstredet',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                arbeidsgiver: '120120124',
                narmesteleder: ExpectMeta.NotInDom,
                egenmeldingsdager: {
                    arbeidsgiver: 'Mt.frank Storbyuniversitet Studiestedettilnoenveldigviktige Pekepinnstredet',
                    svar: 'Nei',
                },
            })(page)
        })

        test('should be able to submit form with missing NL but active arbeidsgiver', async ({ page }) => {
            await gotoScenario('normal', {
                antallArbeidsgivere: 3,
            })(page)

            await filloutArbeidstaker(/Nottinghamshire Missing Narmesteleder/)(page)
            await getRadioInGroup(page)(
                {
                    name: /Er du syk fra flere arbeidsforhold i denne perioden/,
                },
                { name: 'Nei' },
            ).click()

            // Should ask about egenmeldingsdager even though NL is null, but arbeidsforhold is active
            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Nottinghamshire Missing Narmesteleder i perioden/ },
                { name: 'Nei' },
            ).click()

            await expect(page.getByRole('region', { name: 'Se hva som sendes til jobben din' })).toBeVisible()
            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Nottinghamshire Missing Narmesteleder',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                arbeidsgiver: '110110113',
                narmesteleder: ExpectMeta.NotInDom,
                egenmeldingsdager: {
                    arbeidsgiver: 'Nottinghamshire Missing Narmesteleder',
                    svar: 'Nei',
                },
            })(page)
        })

        test('should show info about flere arbeidsforhold and be able to submit form when only one sykmelding for a period but several active arbeidsgiver', async ({
            page,
        }) => {
            await gotoScenario('normal', {
                antallArbeidsgivere: 2,
            })(page)

            await filloutArbeidstaker(/Andeby Brannstation/)(page)
            await getRadioInGroup(page)(
                { name: /Er du syk fra flere arbeidsforhold i denne perioden?/ },
                { name: 'Ja' },
            ).click()

            await expect(
                page.getByText(
                    /Dersom du er syk fra flere arbeidsforhold, må du be legen din om å skrive en sykmelding for hvert arbeidsforhold./,
                ),
            ).toBeVisible()

            await bekreftNarmesteleder('Brannkonstabel Sam')(page)
            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Andeby Brannstation i perioden/ },
                { name: 'Nei' },
            ).click()

            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Andeby Brannstation',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                arbeidsgiver: 'Andeby Brannstation',
                narmesteleder: {
                    navn: 'Brannkonstabel Sam',
                    svar: 'Ja',
                },
                egenmeldingsdager: {
                    arbeidsgiver: 'Andeby Brannstation',
                    svar: 'Nei',
                },
            })(page)
        })
    })

    test.describe('without arbeidsgiver', () => {
        test('should show warning if user does not have any arbeidsforhold', async ({ page }) => {
            await gotoScenario('normal', {
                antallArbeidsgivere: 0,
            })(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('ansatt')(page)

            await expect(
                page.getByText(
                    /Før du går videre, må du be arbeidsgiveren din om å registrere deg i A-meldingen. Når det er gjort blir det oppdatert her, og du kan sende inn sykmeldingen./,
                ),
            ).toBeVisible()
            await expect(page).toHaveNoViolations()
        })

        test('should show error if user tries to send sykmelding without arbeidsgiver', async ({ page }) => {
            await gotoScenario('normal', {
                antallArbeidsgivere: 0,
            })(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await opplysingeneStemmer(page)
            await velgArbeidssituasjon('ansatt')(page)
            await page.getByRole('button', { name: /Send sykmelding/ }).click()

            await expect(
                page.getByText(
                    /For å sende inn sykmeldingen må du fylle ut hvilken arbeidsforhold du er sykmeldt fra./,
                ),
            ).toBeVisible()
            await expect(page).toHaveNoViolations()
        })
    })
})
