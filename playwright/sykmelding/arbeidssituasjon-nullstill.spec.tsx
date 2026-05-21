import { expect, test } from '@playwright/test'

import {
    bekreftNarmesteleder,
    frilanserEgenmeldingsperioder,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    sendSykmelding,
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

    test('skal fjerne submit-lås når arbeidssituasjon byttes etter at backend-kall feiler', async ({ page }) => {
        await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-utenfor-ventetid', (route) => {
            if (route.request().method() === 'GET') {
                return route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Failed to fetch er-utenfor-ventetid' }),
                })
            }
            return route.continue()
        })

        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('selvstendig næringsdrivende')(page)

        await expect(
            page.getByText(
                /Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen/,
            ),
        ).toBeVisible()
        await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()

        await velgArbeidssituasjon('ansatt')(page)
        await expect(page.getByRole('button', { name: /Send sykmelding/ })).toBeEnabled()
        await velgArbeidstaker(/Pontypandy Fire Service/)(page)
        await bekreftNarmesteleder('Station Officer Steele')(page)
        await getRadioInGroup(page)(
            { name: /Brukte du egenmelding hos Pontypandy Fire Service i perioden/ },
            { name: 'Nei' },
        ).click()

        await expect(page.getByRole('button', { name: /Send sykmelding/ })).toBeEnabled()

        await sendSykmelding(page)

        await expect(page.getByText('Sykmeldingen ble sendt')).toBeVisible()
        await page.unrouteAll({ behavior: 'ignoreErrors' })
    })
})
