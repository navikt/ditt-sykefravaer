import { test, expect } from '@playwright/test'

test.describe('Tester cumulative-layout-shift', () => {
    test('Height does not change in happy case after data is loaded', async ({ page }) => {
        // Navigate to the page
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=cummulative-layout-shift')

        // Check if h1 is visible
        // // await expect(page.locator('h1')).toBeVisible(); // Now checks visibility once the element is present
        // await expect(page.locator('main').locator('h1')).toBeVisible()
        // await expect(page.locator('main').locator('h1')).toBeVisible({ timeout: 10000 });

        // Wait for the element to appear and store it in a variable
        const h1Element = await page.waitForSelector('h1', { timeout: 10000 })

        // Now you can interact with or assert on the stored element
        await expect(page.locator('h1').first()).toBeVisible()

        // Check if skeleton elements are visible (should have length 6)
        const skeletons = page.locator('.navds-skeleton')
        await expect(skeletons).toHaveCount(6)

        // Check the document's height
        const expectedHeight = 1419
        const initialHeight = await page.evaluate(() => document.documentElement.scrollHeight)
        expect(initialHeight).toBe(expectedHeight)

        // Wait for the data to be fetched and rendered
        await expect(page.locator('text=Du har en ny sykmelding')).toBeVisible()
        await expect(skeletons).toHaveCount(0)

        // Check the document's height again
        const finalHeight = await page.evaluate(() => document.documentElement.scrollHeight)
        expect(finalHeight).toBe(expectedHeight)
    })
})
