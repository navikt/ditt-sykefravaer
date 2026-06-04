import { expect, test } from '@playwright/test'

import {
    bekreftSykmelding,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgAnnetSituasjon,
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

    test('skal vise hint om arbeidssituasjon og kunne sende inn skjema med arbeidssituasjon annet/Student', async ({
        page,
    }) => {
        await userInteractionsGroup(
            gotoScenario('normal'),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('annet'),
            velgAnnetSituasjon('Student'),
        )(page)
        await expect(page.getByText('Har du valgt rett situasjon?')).toBeVisible()
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

    test('skal vise hint om arbeidssituasjon annet/Dagpenger og kunne sende inn skjema med arbeidssituasjon Arbeidsledig', async ({
        page,
    }) => {
        await userInteractionsGroup(
            gotoScenario('normal'),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('annet'),
            velgAnnetSituasjon('Dagpenger'),
        )(page)
        await expect(page.getByText('Har du valgt rett situasjon?')).toBeVisible()
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
