import { expect } from '@playwright/test'

import { test } from './utils/fixtures'
import { validerCLS } from './utils/cls-validering'

test.describe('Tester arbeidssituasjon', () => {
    test('Bruker med flere arbeidsgivere', async ({ page, getCLS }) => {
        await page.goto('/syk/sykefravaer?testperson=default')

        await page.getByRole('button', { name: 'Hogwarts School of Witchcraft and Wizardry' }).click()

        await expect(page.getByRole('button', { name: 'Meld fra om endring' }).first()).toBeVisible()
        await page.getByRole('button', { name: 'Meld fra om endring' }).first().click()

        const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
        await expect(modal).toBeVisible()
        await expect(modal).toContainText('Albus Dumbledore')
        const bekreftButton = page.getByRole('button', { name: 'Ja, jeg er sikker' })
        await bekreftButton.click()

        await expect(modal).toBeHidden()

        await page.getByRole('button', { name: 'Diagon Alley' }).click()

        await expect(page.getByRole('button', { name: 'Meld fra om endring' }).last()).toBeVisible()
        await page.getByRole('button', { name: 'Meld fra om endring' }).last().click()

        const modal2 = page.getByRole('dialog', { name: 'Endre nærmeste leder' })

        await expect(modal2).toContainText('Endre nærmeste leder')
        await expect(modal2).toContainText('Severus Snape')
        const bekreftButtonSecond = modal2.getByRole('button', { name: 'Ja, jeg er sikker' })
        await bekreftButtonSecond.click()

        await expect(modal2).toBeHidden()

        await validerCLS(getCLS, 'arbeidsgiver accordion and modal')
    })

    test('Avkreft nærmeste leder feiler', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=default')

        const employer = page.getByRole('button', { name: 'Gloucester Cathedral' })
        await employer.click()

        await expect(page.getByRole('button', { name: 'Meld fra om endring' }).first()).toBeVisible()
        await page.getByRole('button', { name: 'Meld fra om endring' }).first().click()

        const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
        await expect(modal).toContainText('Endre nærmeste leder')
        await expect(modal).toContainText('Charity Burbage')
        const bekreftButton = modal.getByRole('button', { name: 'Ja, jeg er sikker' })
        await bekreftButton.click()

        await expect(modal).toContainText('Beklager, det oppstod en feil!')
        await expect(modal).toBeVisible()

        const avbrytButton = modal.getByRole('button', { name: 'Avbryt' })
        await avbrytButton.click()

        await expect(modal).toBeHidden()
        await expect(employer).toBeVisible()
    })

    test('Har narmesteleder og kan avkrefte den', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=snart-slutt')

        const hovedInnhold = page.getByRole('main')
        await expect(hovedInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')

        await page.getByRole('button', { name: 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt' }).click()

        await page.getByRole('button', { name: 'Meld fra om endring' }).click()

        await expect(
            page.getByText(
                'Arbeidsgiveren skal legge til rette for at du kan jobbe helt eller delvis selv om du er syk.',
            ),
        ).toBeVisible()
        await expect(page.getByText('Er det oppgaver jeg kan gjøre selv om jeg er syk?')).toBeVisible()
        await expect(page.getByText('Kan noe endres på arbeidsplassen for at jeg kan få det til?')).toBeVisible()

        const modal = page.getByLabel('Endre nærmeste leder')
        await expect(modal).toContainText('Endre nærmeste leder')
        await expect(modal).toContainText('Albus Dumbledore')
        const bekreftButton = modal.getByRole('button', { name: 'Ja, jeg er sikker' })
        await bekreftButton.click()

        await expect(modal).toBeHidden()

        await expect(hovedInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')
    })
})
