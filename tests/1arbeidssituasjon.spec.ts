// tests/arbeidssituasjon.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Tester arbeidssituasjon', () => {
    test('Bruker med flere arbeidsgivere', async ({ page }) => {
        // Visit the specified URL
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=default')

        // Select the second child of 'din-situasjon' and verify its content, then click it
        const dinSituasjon = page.getByTestId("din-situasjon") // page.locator('[data-testid="din-situasjon"]')
        const firstEmployer = dinSituasjon.locator(':scope > *').nth(1)
        await expect(firstEmployer).toContainText('Hogwarts School of Witchcraft and Wizardry')
        await firstEmployer.click()
        // noe er fucka her
        // Verify the 'arbeidsgiver-accordion' contains specific texts and click 'Meld fra om endring'
        const arbeidsgiverAccordion = page.getByTestId("arbeidsgiver-accordion").first() // locator('[data-testid="arbeidsgiver-accordion"]').first()
        // await arbeidsgiverAccordion.click()
        await page.locator('text=Betaler lønn også etter de 16 første dagene i sykefraværet.').first().waitFor()

        await expect(arbeidsgiverAccordion).toContainText('Betaler lønn også etter de 16 første dagene i sykefraværet.')
        await expect(arbeidsgiverAccordion).toContainText(
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )
        const meldFraOmEndring = arbeidsgiverAccordion.locator('text=Meld fra om endring')
        await meldFraOmEndring.click()

        // In the modal, verify content and click the confirmation button
        const modal = page.locator('.navds-modal')
        // await expect(modal).toContainText('Endre nærmeste leder');
        await expect(page.getByRole('dialog', { name: 'Endre nærmeste leder' })).toBeVisible()
        // const bekreftButton = modal.locator('text=Ja, jeg er sikker');
        const bekreftButton = page.getByRole('button', { name: 'Ja, jeg er sikker' })
        await bekreftButton.click()

        // Verify that the specific text is no longer present in 'arbeidsgiver-accordion'
        await expect(arbeidsgiverAccordion).not.toContainText(
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )

        // Select the third child of 'din-situasjon', verify content, and click it
        const secondEmployer = dinSituasjon.locator(':scope > *').nth(2)
        await expect(secondEmployer).toContainText('Diagon Alley')
        await secondEmployer.click()

        const arbeidsgiverAccordion2 = page.getByTestId("arbeidsgiver-accordion").nth(1) // locator('[data-testid="arbeidsgiver-accordion"]').nth(1)
        // Verify the 'arbeidsgiver-accordion' contains specific texts and click 'Meld fra om endring'
        await expect(arbeidsgiverAccordion2).toContainText(
            'Betaler lønn også etter de 16 første dagene i sykefraværet.',
        )
        await expect(arbeidsgiverAccordion2).toContainText(
            'Arbeidsgiveren har meldt  inn at Severus Snape skal følge deg opp mens du er syk.',
        )
        const meldFraOmEndringSecond = arbeidsgiverAccordion2.locator('text=Meld fra om endring')
        await meldFraOmEndringSecond.click()

        const modal2 = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
        // In the modal, verify content and click the confirmation button
        await expect(modal2).toContainText('Endre nærmeste leder')
        const bekreftButtonSecond = modal2.locator('text=Ja, jeg er sikker')
        await bekreftButtonSecond.click()

        // Verify that the specific text is no longer present in 'arbeidsgiver-accordion'
        await expect(arbeidsgiverAccordion2).not.toContainText(
            'Arbeidsgiveren har meldt inn at Severus Snape skal følge deg opp mens du er syk.',
        )
    })

    test('Avkreft nærmeste leder feiler', async ({ page }) => {
        // Visit the base URL assuming it's required for this test
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=default')

        // Select the fourth child of 'din-situasjon', verify content, and click it
        const dinSituasjon = page.getByTestId("din-situasjon") // locator('[data-testid="din-situasjon"]')
        const employer = dinSituasjon.locator(':scope > *').nth(3)
        await expect(employer).toContainText('Gloucester Cathedral')
        await employer.click()

        // Verify the 'arbeidsgiver-accordion' contains specific text and click 'Meld fra om endring'
        const arbeidsgiverAccordion = page.getByTestId('arbeidsgiver-accordion').nth(2)
        await expect(arbeidsgiverAccordion).toContainText(
            'Arbeidsgiveren har meldt inn at Charity Burbage skal følge deg opp mens du er syk.',
        )
        const meldFraOmEndring = arbeidsgiverAccordion.locator('text=Meld fra om endring')
        await meldFraOmEndring.click()

        // In the modal, verify content and click the confirmation button
        const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' }) // page.locator('.navds-modal');
        await expect(modal).toContainText('Endre nærmeste leder')
        const bekreftButton = modal.locator('text=Ja, jeg er sikker')
        await bekreftButton.click()

        // Verify that an error message is displayed in the modal
        await expect(modal).toContainText('Beklager, det oppstod en feil!')
        await expect(modal).toBeVisible()

        // Click 'Avbryt' to close the modal
        const avbrytButton = modal.locator('text=Avbryt')
        await avbrytButton.click()

        // Verify the modal is no longer visible and the employer selection remains
        await expect(modal).not.toBeVisible()
        await expect(employer).toContainText('Gloucester Cathedral')
    })

    // todo fungerer til hit
    test('Har narmesteleder og kan avkrefte den', async ({ page }) => {
        // Visit the specified URL for this test
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')

        // Verify 'situasjon-innhold' contains specific texts
        const situasjonInnhold = page.getByTestId("situasjon-innhold")//  locator('[data-testid="situasjon-innhold"]')
        await expect(situasjonInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')
        await expect(situasjonInnhold).toContainText('Betaler lønn også etter de 16 første dagene i sykefraværet.')
        await expect(situasjonInnhold).toContainText(
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )

        // Click on the accordion item
        const accordionItem = page
            .locator('.navds-accordion__item')
            .filter({ hasText: 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt' })
        await accordionItem.click()

        // Click 'Meld fra om endring' within 'situasjon-innhold'
        await situasjonInnhold.locator('text=Meld fra om endring').click()

        // Verify the accordion content contains specific texts
        const accordionContent = page.locator('.navds-accordion__content')
        await expect(accordionContent).toContainText(
            'Arbeidsgiveren skal legge til rette for at du kan jobbe helt eller delvis selv om du er syk.',
        )
        await expect(accordionContent).toContainText('Er det oppgaver jeg kan gjøre selv om jeg er syk?')
        await expect(accordionContent).toContainText('Kan noe endres på arbeidsplassen for at jeg kan få det til?')

        // In the modal, verify content and click the confirmation button
        const modal = page.getByLabel('Endre nærmeste leder') // page.locator('.navds-modal');
        await expect(modal).toContainText('Endre nærmeste leder')
        const bekreftButton = modal.locator('text=Ja, jeg er sikker')
        await bekreftButton.click()

        // Verify the modal is no longer visible
        await expect(modal).not.toBeVisible()

        // Verify 'situasjon-innhold' reflects the changes
        await expect(situasjonInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')
        await expect(situasjonInnhold).not.toContainText(
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )
        await expect(situasjonInnhold).toContainText('Betaler lønn også etter de 16 første dagene i sykefraværet.')

        // Optionally, close the accordion
        await accordionItem.click()
    })

    test('Arbeidsgiver forskutterer ikke', async ({ page }) => {
        // Visit the specified URL for this test
        await page.goto('http://localhost:8080/syk/sykefravaer?testperson=arbeidsgiver-forskutterer-ikke')

        // Verify 'situasjon-innhold' contains specific texts and click 'Meld fra om endring'
        const situasjonInnhold = page.getByTestId("situasjon-innhold") // locator('[data-testid="situasjon-innhold"]')
        await expect(situasjonInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')
        await expect(situasjonInnhold).toContainText('Arbeidsgiveren din betaler ikke lønn etter de første 16 dagene.')
        await expect(situasjonInnhold).toContainText(
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )
        await situasjonInnhold.locator('text=Meld fra om endring').click()

        // In the modal, verify content and click the confirmation button
        const modal = page.getByLabel('Endre nærmeste leder') // page.locator('.navds-modal'); // const modal = page.locator('.navds-modal');
        await expect(modal).toContainText('Endre nærmeste leder')
        const bekreftButton = modal.locator('text=Ja, jeg er sikker')
        await bekreftButton.click()

        // Verify the modal is no longer visible
        await expect(modal).not.toBeVisible()

        // Verify 'situasjon-innhold' reflects the changes
        await expect(situasjonInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')
        await expect(situasjonInnhold).toContainText('Arbeidsgiveren din betaler ikke lønn etter de første 16 dagene.')
        await expect(situasjonInnhold).not.toContainText(
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )
    })
})
