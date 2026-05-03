import {
    bekreftSykmelding,
    expectSykmeldingStartDato,
    frilanserEgenmeldingsperioder,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
    velgForsikring,
} from '../utils/user-actions'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { test } from '../utils/fixtures'
import { testAar } from '../../src/data/mock/mock-db/data-creators'

test.describe('Jordbruker', () => {
    test('should be able to submit form when er forste sykmelding', async ({ page }) => {
        await gotoScenario('normal', {
            erForsteSykmelding: true,
        })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('jordbruker')(page)

        await expectSykmeldingStartDato(`${testAar}-01-08`)(page)
        await frilanserEgenmeldingsperioder([{ fom: '20.12.2024' }])(page)
        await velgForsikring('Ja')(page)

        await bekreftSykmelding(page)

        await expectKvittering({
            sendtTil: 'NAV',
            egenmeldingsdagerInfo: ExpectMeta.NotInDom,
        })(page)

        await expectDineSvar({
            arbeidssituasjon: 'Jordbruker',
            selvstendig: {
                egenmeldingsperioder: ['20. desember 2024'],
                forsikring: 'Ja',
            },
        })(page)
    })

    test('should be able to submit form when er ikke forste sykmelding', async ({ page }) => {
        await gotoScenario('normal', {
            erForsteSykmelding: false,
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
