import {
    bekreftSykmelding,
    gotoRoot,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    velgArbeidssituasjon,
} from '../utils/user-actions'
import { test, expect } from '../utils/fixtures'

test.describe('Bekreftet sykmelding', () => {
    test('should reopen brekreftet sykmelding', async ({ page }) => {
        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('annet')(page)
        await bekreftSykmelding(page)

        await gotoRoot(page)

        await navigateToFirstSykmelding('tidligere', '100%')(page)

        await page.getByRole('button', { name: 'GJØR UTFYLLINGEN PÅ NYTT' }).click()
        await expect(page.getByRole('button', { name: 'Bekreft sykmelding' })).toBeVisible()
    })
})
