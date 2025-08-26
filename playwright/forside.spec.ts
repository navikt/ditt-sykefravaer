import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { harSynligTittel } from './utils/test-utils'

test.describe('Tester visning av forside', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer')
    })

    test('Laster startside', async ({ page }) => {
        await expect(page).toHaveURL('http://localhost:3000/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toBeVisible()
    })

    test('Kan trykke inn på sykmeldinger via knapp', async ({ page }) => {
        const sykmeldingerLenke = page.getByRole('link', { name: 'Sykmeldinger' })
        await expect(sykmeldingerLenke).toBeVisible()
        await sykmeldingerLenke.click()
        await harSynligTittel(page, 'Sykmeldinger', 1)
    })

    test('Kan trykke inn på inntektsmeldinger via knapp', async ({ page }) => {
        const sykmeldingerLenke = page.getByRole('link', { name: 'Inntektsmeldinger' })
        await expect(sykmeldingerLenke).toBeVisible()
        await sykmeldingerLenke.click()
        await harSynligTittel(page, 'Inntektsmeldinger', 1)
    })

    test('Kan trykke inn på sykmeldinger via notifikasjon (oppgave)', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykmeldinger?testperson=flere-nye-sykmeldinger')
        const sykmeldingNotifikasjon = page.getByRole('link', { name: 'Du har tre nye sykmeldinger' })
        await expect(sykmeldingNotifikasjon).toBeVisible()
        await sykmeldingNotifikasjon.click()
        await harSynligTittel(page, 'Sykmeldinger', 1)
    })

    test('Kan trykke inn på inntektsmeldinger via notifikasjon (oppgave)', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=mangler-inntektsmelding')
        const inntektsmeldingNotifikasjon = page.getByRole('link', { name: 'Status i saken din om' })
        await expect(inntektsmeldingNotifikasjon).toBeVisible()
        await inntektsmeldingNotifikasjon.click()
        await harSynligTittel(page, 'Vi venter på inntektsmelding', 1)
    })

    test('Kan trykke inn på info om a-ordningen via notifikasjon (varsel)', async ({ page }) => {
        await page.goto('http://localhost:3000/syk/sykefravaer?testperson=forelagt-fra-a-ordningen')
        const aOrdningenNotifikasjon = page.getByRole('link', { name: 'Status i saken din om' })
        await expect(aOrdningenNotifikasjon).toBeVisible()
        await aOrdningenNotifikasjon.click()
        await harSynligTittel(page, 'Vi har hentet opplysninger fra a-ordningen', 1)
    })
})
