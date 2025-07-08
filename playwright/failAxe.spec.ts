import { test } from './utils/fixtures'

test('skal feile axe-validering for knapp uten tilgjengelig navn', async ({ page }) => {
    test.fail()
    // Create a page with a button that has no text or aria-label
    await page.setContent('<button></button>')
})
