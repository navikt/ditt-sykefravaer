import { expect, test } from '@playwright/test'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'

import {
    bekreftNarmesteleder,
    bekreftSykmelding,
    filloutArbeidstaker,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
    velgArbeidstakerArbeidsledig,
} from '../utils/user-actions'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { userInteractionsGroup } from '../utils/test-utils'
import { testDato } from '../../src/data/mock/mock-db/data-creators'

test.describe('Arbeidssituasjon - Arbeidsledig', () => {
    test('burde kunne sende inn skjema med arbeidssituasjon arbeidsledig, uten arbeidsgiver', async ({ page }) => {
        await userInteractionsGroup(
            gotoScenario('normal', { antallArbeidsgivere: 0 }),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('arbeidsledig'),
            bekreftSykmelding,
        )(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            stemmer: 'Ja',
            arbeidssituasjon: 'Arbeidsledig',
            arbeidsledig: ExpectMeta.NotInDom,
        })(page)
    })

    test('skal ikke sende egenmeldingsdager og slikt når først fylt ut som arbeidsgiver, deretter endrer tilbake til arbeidsledig', async ({
        page,
    }) => {
        await userInteractionsGroup(
            gotoScenario('normal'),
            filloutArbeidstaker(/Pontypandy Fire Service/),
            bekreftNarmesteleder('Station Officer Steele', 'Nei'),
        )(page)

        await expect(
            page.getByText('Siden du sier det er feil, ber vi arbeidsgiveren din om å gi oss riktig navn.'),
        ).toBeVisible()

        await page
            .getByRole('group', { name: /Brukte du egenmelding hos Pontypandy Fire Service i perioden/ })
            .getByRole('radio', { name: /Ja/ })
            .click()

        await page
            .getByRole('button', { name: format(testDato, 'EEEE d', { locale: nb }), includeHidden: true, exact: true })
            .click()
        await page.getByRole('button', { name: /Videre/ }).click()
        await page
            .getByRole('group', {
                name: 'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
            })
            .getByRole('radio', { name: /Nei/ })
            .click()

        // Endre til arbeidsledig
        await page
            .getByRole('group', { name: /Jeg er sykmeldt som/i })
            .getByRole('radio', { name: /arbeidsledig/ })
            .click()
        await velgArbeidstakerArbeidsledig(/Pontypandy Fire Service/)(page)

        await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)
        await expectDineSvar({
            stemmer: 'Ja',
            arbeidssituasjon: 'Arbeidsledig',
            arbeidsledig: {
                arbeidsledigFraOrgnummer: '110110110',
            },
        })(page)
    })

    test('skal kunne sende inn skjema med arbeidssituasjon arbeidsledig, med arbeidsgiver', async ({ page }) => {
        await userInteractionsGroup(
            gotoScenario('normal', { antallArbeidsgivere: 2 }),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('arbeidsledig'),
            velgArbeidstakerArbeidsledig(/Pontypandy Fire Service/),
            bekreftSykmelding,
        )(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            stemmer: 'Ja',
            arbeidssituasjon: 'Arbeidsledig',
            arbeidsledig: {
                arbeidsledigFraOrgnummer: '110110110',
            },
        })(page)
    })

    test('skal kunne sende inn skjema med arbeidssituasjon arbeidsledig, når arbeidsgiver er "Ikke relevant"', async ({
        page,
    }) => {
        await userInteractionsGroup(
            gotoScenario('normal', { antallArbeidsgivere: 2 }),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('arbeidsledig'),
            velgArbeidstakerArbeidsledig(/Ikke relevant/),
            bekreftSykmelding,
        )(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            stemmer: 'Ja',
            arbeidssituasjon: 'Arbeidsledig',
            arbeidsledig: ExpectMeta.NotInDom,
        })(page)
    })
})
