import { expect, test } from '@playwright/test'

import {
    frilanserEgenmeldingsperioder,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
    velgArbeidstaker,
    velgForsikring,
} from '../utils/user-actions'
import { getRadioInGroup } from '../utils/test-utils'

test.describe('Nullstilling av brukersvar ved bytte av arbeidssituasjon', () => {
    test('skal nullstille næringsdrivende-svar når arbeidssituasjon byttes fra frilanser til ansatt', async ({
        page,
    }) => {
        await gotoScenario('normal', { erForsteSykmelding: true })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('frilanser')(page)
        await frilanserEgenmeldingsperioder([{ fom: '20.12.2024' }])(page)
        await velgForsikring('Ja')(page)

        await expect(
            getRadioInGroup(page)({ name: /Var du syk og borte fra jobb før du ble sykmeldt/i }, { name: 'Ja' }),
        ).toBeChecked()
        await expect(
            getRadioInGroup(page)({ name: /Har du forsikring som gjelder for de første 16 dagene/i }, { name: 'Ja' }),
        ).toBeChecked()

        await velgArbeidssituasjon('ansatt')(page)
        await velgArbeidssituasjon('frilanser')(page)

        await expect(
            getRadioInGroup(page)({ name: /Var du syk og borte fra jobb før du ble sykmeldt/i }, { name: 'Ja' }),
        ).not.toBeChecked()
        await expect(
            getRadioInGroup(page)({ name: /Har du forsikring som gjelder for de første 16 dagene/i }, { name: 'Ja' }),
        ).not.toBeChecked()
    })

    test('skal nullstille ansatt-svar når arbeidssituasjon byttes fra ansatt til frilanser', async ({ page }) => {
        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('ansatt')(page)
        await velgArbeidstaker(/Pontypandy Fire Service/)(page)

        await expect(page.getByRole('radio', { name: 'Pontypandy Fire Service' })).toBeChecked()

        await velgArbeidssituasjon('frilanser')(page)
        await velgArbeidssituasjon('ansatt')(page)

        await expect(page.getByRole('radio', { name: 'Pontypandy Fire Service' })).not.toBeChecked()
    })

    test('skal nullstille forsikringssvar når arbeidssituasjon byttes fra selvstendig næringsdrivende til frilanser', async ({
        page,
    }) => {
        await gotoScenario('normal', { erForsteSykmelding: false, erUtenforVentetid: false })(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('selvstendig næringsdrivende')(page)
        await velgForsikring('Nei')(page)

        await expect(
            getRadioInGroup(page)({ name: /Har du forsikring som gjelder for de første 16 dagene/i }, { name: 'Nei' }),
        ).toBeChecked()

        await velgArbeidssituasjon('frilanser')(page)

        await expect(
            getRadioInGroup(page)({ name: /Har du forsikring som gjelder for de første 16 dagene/i }, { name: 'Nei' }),
        ).not.toBeChecked()
    })
})
