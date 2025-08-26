import { expect, test } from './utils/fixtures'
import {
    bekreftNarmesteleder,
    filloutArbeidstaker,
    gotoScenario,
    navigateToFirstSykmelding,
    sendSykmelding,
} from './utils/user-actions'
import { getRadioInGroup, harSynligOverskrift } from './utils/test-utils'
import { forventBrodsmule, forventFlerebrodsmuler, klikkPaBrodsmule, standardBrodsmuler } from './utils/brodsmule-utils'
import { expectKvittering, ExpectMeta } from './utils/user-expects'

test.describe('Tester Brodsmuler', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer')
        const neiTilCookies = page.getByTestId('consent-banner-refuse-optional')
        await neiTilCookies.click()
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
})
