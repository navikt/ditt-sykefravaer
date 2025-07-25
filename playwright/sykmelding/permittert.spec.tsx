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
import { test } from '../utils/fixtures'

test.describe('Arbeidssituasjon - Permittert', () => {
    /**
     * This fallback from PERMITTERT to ARBEIDSLEDIG used to happen in the frontend, it has been moved
     * to the mapping in the API layer
     */
    test('should submit ARBEIDSLEDIG when user choose radio button permittert', async ({ page }) => {
        await userInteractionsGroup(
            gotoScenario('normal', { antallArbeidsgivere: 0 }),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('permittert'),
            bekreftSykmelding,
        )(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)
        await expectDineSvar({
            arbeidssituasjon: 'Arbeidsledig',
        })(page)
    })

    test('should be able to submit form with work situation permittert, with arbeidsgiver', async ({ page }) => {
        await userInteractionsGroup(
            gotoScenario('normal', { antallArbeidsgivere: 2 }),
            navigateToFirstSykmelding('nye', '100%'),
            opplysingeneStemmer,
            velgArbeidssituasjon('permittert'),
            velgArbeidstakerArbeidsledig(/Pontypandy Fire Service/, 'permittert'),
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
