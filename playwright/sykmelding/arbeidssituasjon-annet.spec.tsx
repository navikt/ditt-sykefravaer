import { expect, test } from '@playwright/test'

import {
    bekreftSykmelding,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
    velgArbeidstakerArbeidsledig,
} from '../utils/user-actions'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { userInteractionsGroup } from '../utils/test-utils'

test.describe('Arbeidssituasjon - Annet', () => {
    test('skal kunne sende inn skjema med arbeidssituasjon annet', async ({ page }) => {
        await userInteractionsGroup(
            gotoScenario('normal'),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('annet'),
            bekreftSykmelding,
        )(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            stemmer: 'Ja',
            arbeidssituasjon: 'Annet',
        })(page)
    })

    test('skal vise info-alert når arbeidssituasjon annet velges', async ({ page }) => {
        await userInteractionsGroup(
            gotoScenario('normal'),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('annet'),
        )(page)
        await expect(
            page.getByText('Sykmeldingen gjelder arbeidet du er sykmeldt fra. Velg den kategorien som beskriver'),
        ).toBeVisible()
        await bekreftSykmelding(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            stemmer: 'Ja',
            arbeidssituasjon: 'Annet',
        })(page)
    })

    test('skal kunne bytte fra annet til arbeidsledig og sende inn skjema', async ({ page }) => {
        await userInteractionsGroup(
            gotoScenario('normal'),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('annet'),
        )(page)
        await expect(
            page.getByText('Sykmeldingen gjelder arbeidet du er sykmeldt fra. Velg den kategorien som beskriver'),
        ).toBeVisible()
        await userInteractionsGroup(
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
})
