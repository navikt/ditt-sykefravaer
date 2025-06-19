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
    // test('should load PDF page directly by URL', async ({ page }) => {
    //     await gotoScenario('normal')(page)
    //     await navigateToFirstSykmelding('nye', '100%')(page)
    //     await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()

    //     const url = page.url()
    //     const match = url.match(/\/sykmelding\/([0-9a-fA-F-]{36})/)
    //     const id = match?.[1]
    //     await page.goto(`http://localhost:3000/syk/sykefravaer/${id}/pdf`)

    //     // sleep for 20 seconds
    //     await new Promise((resolve) => setTimeout(resolve, 20000))

    //     await page.waitForLoadState('domcontentloaded')

    //     // Check that the PDF is loaded
    //     // const pdfElement = await page.$('embed[type="application/pdf"], object[type="application/pdf"]')
    //     // expect(pdfElement).not.toBeNull()

    //     // Check for any expected elements on the page
    //     //await expect(page).toHaveURL(/\/sykefravaer\/.*\/pdf/)
    // })

    test('confirm PDF download from regnskapnorge without saving', async ({ page }) => {
        const url =
            'https://www.regnskapnorge.no/globalassets/naringspolitikk/kartlegging-av-administrative-sanksjoner-i-naringslivet-31.1-nyanalyse---endelig-rapport.pdf'

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.evaluate((url) => {
                const a = document.createElement('a')
                a.href = url
                a.download = ''
                document.body.appendChild(a)
                a.click()
                a.remove()
            }, url),
        ])

        const filename = download.suggestedFilename()
        expect(filename).toMatch(/\.pdf$/)

        // Optional: confirm it's a non-empty file (buffer in memory)
        const stream = await download.createReadStream()
        let totalBytes = 0
        for await (const chunk of stream) {
            totalBytes += chunk.length
        }

        expect(totalBytes).toBeGreaterThan(0)
    })

    test.describe('normal situation', () => {
        //         test('PDF loads directly and renders in browser', async ({ page }) => {
        //   await page.goto('https://www.regnskapnorge.no/globalassets/naringspolitikk/kartlegging-av-administrative-sanksjoner-i-naringslivet-31.1-nyanalyse---endelig-rapport.pdf')

        //   // Wait briefly to allow rendering (especially in headed mode)
        //   await page.waitForTimeout(2000)

        //   // Check for an embedded PDF viewer
        //   const pdfViewer = await page.$('embed[type="application/pdf"], object[type="application/pdf"]')
        //   expect(pdfViewer).not.toBeNull()
        // })

        // test('PDF loads in new tab with embed/object', async ({ context, page }) => {
        //   await page.goto('https://example.com') // or any base page

        //   const [pdfPage] = await Promise.all([
        //     context.waitForEvent('page'),
        //     page.evaluate(() => {
        //       window.open('https://www.regnskapnorge.no/globalassets/naringspolitikk/kartlegging-av-administrative-sanksjoner-i-naringslivet-31.1-nyanalyse---endelig-rapport.pdf')
        //     }),
        //   ])

        // //   await pdfPage.waitForLoadState('domcontentloaded')
        // await pdfPage.waitForLoadState('load')

        //   // Check that the new tab is the PDF
        //   await expect(pdfPage).toHaveURL(/\.pdf$/)

        //   // Look for a PDF viewer element
        //   const pdfViewer = await pdfPage.$('embed[type="application/pdf"], object[type="application/pdf"]')
        //   expect(pdfViewer).not.toBeNull()
        // })

        test('burde kunne printe ut info om sykmeldingen, tester tekst', async ({ page }) => {
            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()

            const url = page.url()
            const match = url.match(/\/sykmelding\/([0-9a-fA-F-]{36})/)
            const id = match?.[1]
            expect(id).toBeTruthy()

            const downloadUrl = `http://localhost:3000/syk/sykefravaer/${id}/pdf`

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

        test('burde kunne printe ut info om sykmeldingen', async ({ page }) => {
            await gotoScenario('normal')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)
            await expect(page.getByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeVisible()

            const url = page.url()
            const match = url.match(/\/sykmelding\/([0-9a-fA-F-]{36})/)
            const id = match?.[1]
            expect(id).toBeTruthy()

            const downloadUrl = `http://localhost:3000/syk/sykefravaer/${id}/pdf`

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

            // Confirm download has non-zero size (without saving)
            const stream = await download.createReadStream()
            let totalBytes = 0
            for await (const chunk of stream) {
                totalBytes += chunk.length
            }

            expect(totalBytes).toBeGreaterThan(0)
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
