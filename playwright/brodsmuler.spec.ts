import { expect, test } from './utils/fixtures'
import {
    bekreftNarmesteleder,
    filloutArbeidstaker,
    gotoScenario,
    navigateToFirstSykmelding,
    sendSykmelding,
} from './utils/user-actions'
import { getRadioInGroup, harSynligOverskrift } from './utils/test-utils'
import {
    forventBrodsmule,
    forventFlerebrodsmuler,
    klikkPaBrodsmule,
    lagBrodsmule,
    standardBrodsmuler,
} from './utils/brodsmule-utils'
import { expectKvittering, ExpectMeta } from './utils/user-expects'

test.describe('Tester Brodsmuler', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer')
        // Vent på at siden laster helt før vi fortsetter
        await page.waitForLoadState('networkidle')

        // Klikk bort cookie-banner først
        const neiTilCookies = page.getByTestId('consent-banner-refuse-optional')
        if (await neiTilCookies.isVisible()) {
            await neiTilCookies.click()
        }

        // Så sjekk at hovedoverskriften er synlig
        await harSynligOverskrift(page, 'Ditt sykefravær', 1)
    })

    test('Burde vise brodsmuler på forsiden', async ({ page }) => {
        await page.goto('/syk/sykefravaer')

        await forventBrodsmule(page, standardBrodsmuler.minSide)
    })

    test('Burde vise brodsmuler på /sykmeldinger', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger')

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.sykefravaer])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på /sykmeldinger/[sykmeldingId]', async ({ page }) => {
        await page.goto('/syk/sykefravaer/sykmeldinger')

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

        await navigateToFirstSykmelding('nye', '100%')(page)
        await harSynligOverskrift(page, 'Sykmelding', 1)

        await gotoScenario('normal')(page)
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

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.sykefravaer])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på /inntektsmeldinger/[inntektsmeldingId]', async ({ page }) => {
        await page.goto('/syk/sykefravaer/inntektsmeldinger')

        // Naviger til første inntektsmelding hvis tilgjengelig
        const forsteInntektsmelding = page.locator('[data-testid^="inntektsmelding-card-"]').first()
        const harInntektsmeldinger = await forsteInntektsmelding.isVisible().catch(() => false)

        if (harInntektsmeldinger) {
            await forsteInntektsmelding.click()

            // Vent på at siden laster og få organisasjonsnavn fra brodsmule
            await page.waitForLoadState('networkidle')
            const organisasjonsBrodsmule = page.locator('nav[aria-label="breadcrumbs"] a').last()
            const organisasjonsnavn = await organisasjonsBrodsmule.textContent()

            await forventFlerebrodsmuler(page, [
                standardBrodsmuler.minSide,
                standardBrodsmuler.sykefravaer,
                standardBrodsmuler.inntektsmeldinger,
            ])

            // Test at organisasjonsbrodsmule er synlig (dynamisk navn)
            if (organisasjonsnavn) {
                const dynamiskBrodsmule = lagBrodsmule(organisasjonsnavn, /\/inntektsmeldinger\/.+/, true)
                await forventBrodsmule(page, dynamiskBrodsmule)
            }

            await klikkPaBrodsmule(page, 'Inntektsmeldinger', true)
            await expect(page).toHaveURL(/\/syk\/sykefravaer\/inntektsmeldinger$/)
        } else {
            test.skip(true, 'Ingen inntektsmeldinger tilgjengelig for testing')
        }
    })

    test('Burde vise brodsmuler på /manglende-inntektsmelding', async ({ page }) => {
        await page.goto('/syk/sykefravaer/manglende-inntektsmelding')

        await forventFlerebrodsmuler(page, [
            standardBrodsmuler.minSide,
            standardBrodsmuler.sykefravaer,
            standardBrodsmuler.manglendeInntektsmelding,
        ])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på /opplysninger-fra-a-ordningen', async ({ page }) => {
        await page.goto('/syk/sykefravaer/opplysninger-fra-a-ordningen')

        await forventFlerebrodsmuler(page, [
            standardBrodsmuler.minSide,
            standardBrodsmuler.sykefravaer,
            standardBrodsmuler.opplysningerFraAordningen,
        ])

        await klikkPaBrodsmule(page, 'Ditt sykefravær', true)
        await expect(page).toHaveURL(/\/syk\/sykefravaer$/)
    })

    test('Burde vise brodsmuler på 404-side', async ({ page }) => {
        await page.goto('/syk/sykefravaer/ikke-eksisterende-side')

        await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.ukjentSide])
    })

    test('Burde vise brodsmuler på 500-side', async ({ page }) => {
        // Simuler serverfeil ved å gå til en side som kan trigge 500-feil
        const response = await page.goto('/syk/sykefravaer/test-server-error')

        if (response?.status() === 500) {
            await forventFlerebrodsmuler(page, [standardBrodsmuler.minSide, standardBrodsmuler.ukjentFeil])
        } else {
            // Hopp over test hvis serverfeil ikke kan simuleres
            test.skip(true, 'Kan ikke simulere serverfeil i testmiljø')
        }
    })
})
