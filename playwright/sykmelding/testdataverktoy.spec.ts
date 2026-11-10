import { Page } from '@playwright/test'

import { expect, test } from '../utils/fixtures'
import { gotoScenario } from '../utils/user-actions'
import { tabUntilFocusedContainsText } from '../utils/tastaturSnarvei'

async function apneVerktoy(page: Page): Promise<void> {
    await page.getByRole('button', { name: 'Verktøy for testing' }).click()
    await expect(page.getByRole('dialog', { name: 'Testdataverktøy' })).toBeVisible()
}

async function sessionId(page: Page): Promise<string | undefined> {
    const cookies = await page.context().cookies()
    return cookies.find((cookie) => cookie.name === 'next-session-id')?.value
}

// Markerer dokumentet slik at vi kan verifisere at siden faktisk lastes på nytt (ikke klientnavigasjon).
async function markerDokument(page: Page): Promise<void> {
    await page.evaluate(() => {
        ;(window as unknown as { __fullLast?: boolean }).__fullLast = true
    })
}

async function erMarkert(page: Page): Promise<boolean> {
    return page.evaluate(() => (window as unknown as { __fullLast?: boolean }).__fullLast === true)
}

test.describe('Testdataverktøy for sykmeldinger', () => {
    test('bytter scenario med full sideinnlasting og ny mock-økt, også ved gjentatt valg av samme scenario', async ({
        page,
    }) => {
        await gotoScenario('normal')(page)
        await expect(page.getByRole('region', { name: 'Nye sykmeldinger' })).toBeVisible()
        await expect(page.getByText('Du har ingen nye sykmeldinger')).toBeHidden()

        await markerDokument(page)
        const forsteSession = await sessionId(page)
        expect(forsteSession).toBeTruthy()

        await apneVerktoy(page)
        const ingenSykmeldinger = page.getByRole('link', { name: 'Ingen sykmeldinger' })
        await expect(ingenSykmeldinger).toHaveAttribute(
            'href',
            '/syk/sykefravaer/sykmeldinger/?scenario=ingenSykmeldinger',
        )
        await ingenSykmeldinger.click()

        await expect(page).toHaveURL(/\/syk\/sykefravaer\/sykmeldinger\/?\?scenario=ingenSykmeldinger$/)
        await expect(page.getByText('Du har ingen nye sykmeldinger')).toBeVisible()
        expect(await erMarkert(page)).toBe(false)
        const andreSession = await sessionId(page)
        expect(andreSession).toBeTruthy()
        expect(andreSession !== forsteSession).toBe(true)

        // Gjentatt valg av samme scenario: samme URL, men siden må likevel lastes på nytt med ny økt.
        await markerDokument(page)
        await apneVerktoy(page)
        await page.getByRole('link', { name: 'Ingen sykmeldinger' }).click()

        await expect(page.getByText('Du har ingen nye sykmeldinger')).toBeVisible()
        await expect.poll(() => erMarkert(page)).toBe(false)
        await expect
            .poll(async () => {
                const nySession = await sessionId(page)
                return Boolean(nySession) && nySession !== andreSession
            })
            .toBe(true)

        // Tilbake til et scenario med data.
        await apneVerktoy(page)
        await page.getByRole('link', { name: 'En ny og et par innsendte (standard)' }).click()
        await expect(page).toHaveURL(/scenario=normal$/)
        await expect(page.getByRole('region', { name: 'Nye sykmeldinger' })).toBeVisible()
        await expect(page.getByText('Du har ingen nye sykmeldinger')).toBeHidden()
    })

    test('kan velge scenario med tastatur', async ({ page, browserName }) => {
        await gotoScenario('normal')(page)
        await expect(page.getByRole('region', { name: 'Nye sykmeldinger' })).toBeVisible()
        await apneVerktoy(page)

        const lenke = await tabUntilFocusedContainsText(browserName, page, 'Ingen sykmeldinger', { maxTabs: 20 })
        await expect(lenke).toHaveRole('link')

        await page.keyboard.press('Enter')

        await expect(page).toHaveURL(/scenario=ingenSykmeldinger$/)
        await expect(page.getByText('Du har ingen nye sykmeldinger')).toBeVisible()
    })
})
