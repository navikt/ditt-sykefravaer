import { test, expect } from '@playwright/test'
// import { checkA11y } from 'axe-playwright';

test.describe('Tester visning av forside', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer')
    })

    test('Laster startside', async ({ page }) => {
        await expect(page).toHaveURL('http://localhost:8080/syk/sykefravaer')
        await expect(page.locator('text=Du har en ny søknad om sykepenger')).toBeVisible()

        // New assertion to check for the image
        // TODO remove the line below
        // const image = page.locator('img[src="https://picsum.photos/200/300"]');
        // await expect(image).toBeVisible();

        // await checkA11y(page);
    })
})
