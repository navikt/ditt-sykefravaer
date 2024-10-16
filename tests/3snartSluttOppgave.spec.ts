import { test, expect } from '@playwright/test'
import * as playwright from 'playwright' // TypeScript
test.describe('Tester snart slutt oppgave', () => {
    test('Har riktig lenke', async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')
        await page.waitForTimeout(10)
        // Exclude links with "testperson" in the href attribute
        //const validLink = page.locator('a:has-text("Snart slutt på sykepengene")').locator(':not([href*="testperson"])');
        const validLink = page.locator('main').locator('a:has-text("Snart slutt på sykepengene")').last()

        await expect(validLink).toBeVisible()

        const oppgaver = page.getByTestId("oppgaver")
        await expect(oppgaver).toHaveCount(1)
        await expect(oppgaver.last()).toContainText('Snart slutt på sykepengene')
        // // await expect(oppgaver.last()).toHaveAttribute('href', 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene');
        // const target = oppgaver.last()
        // const targetHref = await target.getAttribute("url")
        // expect(targetHref).toContain('/syk/info/snart-slutt-pa-sykepengene')

        // Assert that there is exactly one such element
        await expect(oppgaver).toHaveCount(1)

        // Check if the first element contains the specified text
        await expect(oppgaver.first()).toContainText('Snart slutt på sykepengene')

        const firstOppgave = oppgaver.first()
        const href = 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene' // Replace with the desired href
        const linkExists = (await firstOppgave.locator(`a[href="${href}"]`).count()) > 0
        expect(linkExists).toBeTruthy()

        // Verify that the first element has the specified href attribute
        // await expect(oppgaver.first()).toHaveAttribute('href');

        //  const href = await oppgaver.last().getAttribute('href');
        // expect(href).toContain('/syk/info/snart-slutt-pa-sykepengene');
        // expect(href).toContain('/syk/info/snart-slutt-pa-sykepengene');
    })
})
