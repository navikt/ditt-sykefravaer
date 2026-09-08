import { Page } from '@playwright/test'

export async function gotoRoot(page: Page): Promise<void> {
    await page.goto(`/syk/sykefravaer/sykmeldinger/`)
}

export async function sendSykmelding(page: Page): Promise<void> {
    await page.getByRole('button', { name: /Send sykmelding/ }).click()
    await page.waitForURL('**/kvittering')
}

export async function bekreftSykmelding(page: Page): Promise<void> {
    await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()
    await page.waitForURL('**/kvittering')
}
