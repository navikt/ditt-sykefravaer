import { Page } from '@playwright/test'

import { expect, test } from './utils/fixtures'
import {
    bekreftNarmesteleder,
    filloutArbeidstaker,
    navigateToFirstSykmelding,
    sendSykmelding,
} from './utils/user-actions'
import { getRadioInGroup, harSynligOverskrift } from './utils/test-utils'
import { forventBrodsmule, forventFlerebrodsmuler, klikkPaBrodsmule, standardBrodsmuler } from './utils/brodsmule-utils'
import { expectKvittering, ExpectMeta } from './utils/user-expects'

async function neiTilCookies(page: Page) {
    await page.waitForLoadState('networkidle')

    const neiTilCookies = page.getByTestId('consent-banner-refuse-optional')
    if (await neiTilCookies.isVisible()) {
        await neiTilCookies.click()
    }
}

test.describe('Tester Brodsmuler', () => {
    test('Burde vise brodsmuler på forsiden', async ({ page }) => {
        await page.goto('/syk/sykefravaer')
        await neiTilCookies(page)

        await forventBrodsmule(page, standardBrodsmuler.minSide)
    })

    test('Burde vise brodsmuler på /sykmeldinger', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger')
        await neiTilCookies(page)

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.sykefravaer])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på /sykmeldinger/[sykmeldingId]', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger')
        await neiTilCookies(page)

        await navigateToFirstSykmelding('nye', '100%')(page)
        await harSynligOverskrift(page, 'Sykmelding', 1)

        await forventFlerebrodsmuler(page, [
            standardBrodsmuler.minSide,
            standardBrodsmuler.sykefravaer,
            standardBrodsmuler.sykmeldinger,
        ])

        await klikkPaBrodsmule(page, 'Sykmeldinger')
        await expect(page).toHaveURL(/\/syk\/sykefravaer\/sykmeldinger$/)
    })

    test('Burde vise brodsmuler på /sykmeldinger/[sykmeldingId]/kvittering', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger')
        await neiTilCookies(page)

        await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
        await bekreftNarmesteleder('Station Officer Steele')(page)

        await getRadioInGroup(page)(
            { name: /Brukte du egenmelding hos Pontypandy Fire Service i perioden/ },
            { name: 'Nei' },
        ).click()

        await sendSykmelding(page)

        await expectKvittering({
            sendtTil: 'Pontypandy Fire Service',
            egenmeldingsdagerInfo: ExpectMeta.InDom,
        })(page)

        await forventFlerebrodsmuler(page, [
            standardBrodsmuler.minSide,
            standardBrodsmuler.sykefravaer,
            standardBrodsmuler.sykmeldinger,
            standardBrodsmuler.sykmelding,
        ])

        await klikkPaBrodsmule(page, 'Sykmelding', true)
        await harSynligOverskrift(page, 'Sykmelding', 1)
    })

    test('Burde vise brodsmuler på /inntektsmeldinger', async ({ page }) => {
        await page.goto('/syk/sykefravaer/inntektsmeldinger')
        await neiTilCookies(page)

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.sykefravaer])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på /inntektsmeldinger/[inntektsmeldingId]', async ({ page }) => {
        await page.goto('/syk/sykefravaer/inntektsmeldinger')
        await neiTilCookies(page)

        const forsteInntektsmelding = page.getByRole('link', { name: 'Matbutikken AS, Kjelsås' })
        await expect(forsteInntektsmelding).toBeVisible()
        await forsteInntektsmelding.click()

        await harSynligOverskrift(page, 'Inntektsmelding fra Matbutikken AS, Kjelsås', 2)

        await forventFlerebrodsmuler(page, [
            standardBrodsmuler.minSide,
            standardBrodsmuler.sykefravaer,
            standardBrodsmuler.inntektsmeldinger,
        ])

        await expect(page.getByRole('listitem').filter({ hasText: 'Matbutikken AS, Kjelsås' })).toBeVisible()

        await klikkPaBrodsmule(page, 'Inntektsmeldinger', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer\/inntektsmeldinger$/)
    })

    test('Burde vise brodsmuler på info om manglende inntektsmelding', async ({ page }) => {
        await page.goto('/syk/sykefravaer/inntektsmelding')
        await neiTilCookies(page)

        await harSynligOverskrift(page, 'Vi venter på inntektsmelding fra arbeidsgiveren din', 1)

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.sykefravaer])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på info om a-ordnigen', async ({ page }) => {
        await page.goto('/syk/sykefravaer/beskjed/123456y7?testperson=forelagt-fra-a-ordningen')
        await neiTilCookies(page)

        await harSynligOverskrift(page, 'Vi har hentet opplysninger fra a-ordningen', 1)

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.sykefravaer])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på 404-side', async ({ page }) => {
        await page.goto('/syk/sykefravaer/ikke-eksisterende-side')
        await harSynligOverskrift(page, 'Fant ikke siden', 1)

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.sykefravaer])
    })
})
