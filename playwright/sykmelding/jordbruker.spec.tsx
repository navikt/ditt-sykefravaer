import {
    bekreftSykmelding,
    expectOppfolgingsdato,
    frilanserEgenmeldingsperioder,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
    velgForsikring,
} from '../utils/user-actions'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { test } from '../utils/fixtures'

test.describe('Jordbruker', () => {
    test('should be able to submit form within ventetid', async ({ page }) => {
        await gotoScenario('normal', {
            erUtenforVentetid: false,
            oppfolgingsdato: '2021-04-01',
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('jordbruker')(page)

        await expectOppfolgingsdato('2021-04-01')(page)
        await frilanserEgenmeldingsperioder([{ fom: '20.12.2020' }])(page)
        await velgForsikring('Ja')(page)

        await bekreftSykmelding(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            arbeidssituasjon: 'Jordbruker',
            selvstendig: {
                egenmeldingsperioder: ['20. desember 2020'],
                forsikring: 'Ja',
            },
        })(page)
    })

    test('should be able to submit form outside ventetid', async ({ page }) => {
        await gotoScenario('normal', {
            erUtenforVentetid: true,
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('jordbruker')(page)

        await bekreftSykmelding(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            arbeidssituasjon: 'Jordbruker',
            selvstendig: {
                egenmeldingsperioder: ExpectMeta.NotInDom,
                forsikring: ExpectMeta.NotInDom,
            },
        })(page)
    })
})
