import { expect } from '@playwright/test'

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
import { userInteractionsGroup } from '../utils/test-utils'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { test } from '../utils/fixtures'
import { testAar } from '../../src/data/mock/mock-db/data-creators'

const navigateToFirstAndPickSituasjon = userInteractionsGroup(
    navigateToFirstSykmelding('nye', '100%'),
    opplysingeneStemmer,
    velgArbeidssituasjon('selvstendig næringsdrivende'),
)

test.describe('Selvstendig næringsdrivende', () => {
    test.describe('Er forste sykmelding', () => {
        test('should be able to submit form', async ({ page }) => {
            await userInteractionsGroup(
                gotoScenario('normal', {
                    erForsteSykmelding: true,
                }),
                navigateToFirstAndPickSituasjon,
                expectSykmeldingStartDato(`${testAar}-01-08`),
                frilanserEgenmeldingsperioder([{ fom: `28.12.${testAar - 1}` }]),
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
                    egenmeldingsperioder: [`28. desember ${testAar - 1}`],
                    forsikring: 'Ja',
                },
            })(page)
        })
    })

    test.describe('Er ikke forste sykmelding', () => {
        test('should be able to submit form', async ({ page }) => {
            await userInteractionsGroup(
                gotoScenario('normal', {
                    erForsteSykmelding: false,
                    erUtenforVentetid: true,
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

    test.describe('Egenmeldingsperioder', () => {
        test('skal vise feilmelding hvis dato er mer enn 18 dager før sykmeldingen', async ({ page }) => {
            await userInteractionsGroup(
                gotoScenario('normal', { erForsteSykmelding: true }),
                navigateToFirstAndPickSituasjon,
                expectSykmeldingStartDato(`${testAar}-01-08`),
                frilanserEgenmeldingsperioder([{ fom: `20.12.${testAar - 1}` }]),
            )(page)

            await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()

            await expect(
                page.getByRole('link', {
                    name: 'Datoen kan ikke være tidligere enn 18 dager før sykmeldingens start-dato.',
                }),
            ).toBeVisible()
        })
    })
})
