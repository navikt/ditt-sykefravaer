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
import { userInteractionsGroup } from '../utils/test-utils'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { test } from '../utils/fixtures'

const navigateToFirstAndPickSituasjon = userInteractionsGroup(
    navigateToFirstSykmelding('nye', '100%'),
    opplysingeneStemmer,
    velgArbeidssituasjon('selvstendig næringsdrivende'),
)

test.describe('Selvstendig næringsdrivende', () => {
    test.describe('Within ventetid', () => {
        test('should be able to submit form', async ({ page }) => {
            await userInteractionsGroup(
                gotoScenario('normal', {
                    oppfolgingsdato: '2021-04-05',
                    ventetidFom: '2025-01-08',
                }),
                navigateToFirstAndPickSituasjon,
                expectOppfolgingsdato('2025-01-08'),
                frilanserEgenmeldingsperioder([{ fom: '20.12.2024' }]),
                velgForsikring('Ja'),
                bekreftSykmelding,
            )(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Selvstendig næringsdrivende',
                selvstendig: {
                    egenmeldingsperioder: ['20. desember 2024'],
                    forsikring: 'Ja',
                },
            })(page)
        })

        test('should use first fom in sykmelding period if ventetid and oppfolgingsdato is missing', async ({
            page,
        }) => {
            await userInteractionsGroup(
                gotoScenario('normal', {
                    oppfolgingsdato: null,
                    ventetidFom: null,
                }),
                navigateToFirstAndPickSituasjon,
                expectOppfolgingsdato('2025-01-08'),
                frilanserEgenmeldingsperioder([{ fom: '20.12.2024' }]),
                velgForsikring('Ja'),
                bekreftSykmelding,
            )(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Selvstendig næringsdrivende',
                selvstendig: {
                    egenmeldingsperioder: ['20. desember 2024'],
                    forsikring: 'Ja',
                },
            })(page)
        })
    })

    test.describe('Outside ventetid', () => {
        test('should be able to submit form', async ({ page }) => {
            await userInteractionsGroup(
                gotoScenario('normal', {
                    erUtenforVentetid: true,
                    ventetidFom: '2024-12-01',
                }),
                navigateToFirstAndPickSituasjon,
                bekreftSykmelding,
            )(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Selvstendig næringsdrivende',
                selvstendig: {
                    egenmeldingsperioder: ExpectMeta.NotInDom,
                    forsikring: ExpectMeta.NotInDom,
                },
            })(page)
        })
    })
})
