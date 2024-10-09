import { test, expect } from '@playwright/test';

test.describe('Tester snart slutt oppgave', () => {
    test('Har riktig lenke', async ({ page }) => {
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt');

        await expect(page.locator('text=Snart slutt på sykepengene')).toBeVisible();
        const oppgaver = page.locator('[data-testid="oppgaver"]');
        await expect(oppgaver).toHaveCount(1);
        await expect(oppgaver.first()).toContainText('Snart slutt på sykepengene');
        await expect(oppgaver.first()).toHaveAttribute('href', 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene');
    });
});
