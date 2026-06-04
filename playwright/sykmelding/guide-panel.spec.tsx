import test, { expect } from '@playwright/test'

import { gotoScenario, navigateToFirstSykmelding } from '../utils/user-actions'

test.describe('Guide panel', () => {
    test('skal vise guidepanel om egenmeldt', async ({ page }) => {
        await gotoScenario('egenmeldt')(page)
        await navigateToFirstSykmelding('nye', 'egenmelding')(page)

        await expect(
            page.getByText(
                'Hei, denne egenmeldingen er utløpt og kan derfor ikke benyttes. Du kan fortsatt se opplysninger fra egenmeldingen under.',
            ),
        ).toBeVisible()
    })

    test('skal vise guidepanel hvis bruker er over 70 år', async ({ page }) => {
        await gotoScenario('overSytti')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)

        await expect(page.getByText('Når du har passert 70 år, har du ikke lenger rett til sykepenger.')).toBeVisible()
    })

    test('skal vise guidepanel hvis sykmelding er under 20%', async ({ page }) => {
        await gotoScenario('under20Prosent')(page)
        await navigateToFirstSykmelding('nye', 'papirsykmelding')(page)

        await expect(
            page.getByText(
                'Denne sykmeldingen viser at du er 14 prosent sykmeldt. Hvis du er under 20 prosent sykmeldt, har du ikke rett til sykepenger.',
            ),
        ).toBeVisible()
    })

    test.describe('Merknadtype', () => {
        test('skal vise guidepanel når sykmelding har merknad DELVIS_GODKJENT', async ({ page }) => {
            await gotoScenario('delvisGodkjentTilbakedatering')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)

            await expect(page.getByRole('heading', { name: 'Sykmeldingen din er delvis godkjent' })).toBeVisible()
            await expect(page.getByRole('button', { name: 'Bekreft sykmelding ' })).toBeVisible()
        })

        test('skal vise guidepanel når sykmelding har merknad TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER', async ({
            page,
        }) => {
            await gotoScenario('tilbakedateringKreverMerInfo')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)

            await expect(page.getByRole('heading', { name: 'Behov for mer opplysninger' })).toBeVisible()
            await expect(page.getByRole('button', { name: 'Bekreft sykmelding ' })).toBeVisible()
        })

        test('skal vise guidepanel i åpen sykmelding med merknad UNDER_BEHANDLING', async ({ page }) => {
            await gotoScenario('harUnderBehandlingUsent')(page)
            await navigateToFirstSykmelding('nye', '100%')(page)

            await expect(
                page.getByText(
                    'Sykmeldingen din er skrevet tilbake i tid, og NAV må derfor vurdere om det er en gyldig grunn til at sykmeldingen starter før du var i kontakt med legen.',
                ),
            ).toBeVisible()
            await expect(page.getByRole('button', { name: 'Bekreft sykmelding' })).toBeVisible()
        })

        test('skal vise guidepanel i sendt sykmelding for under (manuell) behandling', async ({ page }) => {
            await gotoScenario('harUnderBehandling')(page)
            await navigateToFirstSykmelding('under-behandling', '100%')(page)

            await expect(
                page.getByText(
                    'Sykmeldingen din er skrevet tilbake i tid, og NAV må derfor vurdere om det er en gyldig grunn til at sykmeldingen starter før du var i kontakt med legen.',
                ),
            ).toBeVisible()
            await expect(page.getByRole('heading', { name: 'Sykmeldingen er sendt' })).toBeVisible()
        })
    })
})

test.describe('Alert', () => {
    test('skal vise varsel når sykmelding har status UTGATT', async ({ page }) => {
        await gotoScenario('utgatt')(page)
        await navigateToFirstSykmelding('tidligere', '100%')(page)

        await expect(page.getByRole('heading', { name: 'Sykmeldingen er utgått' })).toBeVisible()
    })
})
