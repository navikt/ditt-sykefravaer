import { expect } from '@playwright/test'

import {
    ALBUS_DUMBLEDORE_LEDER_ID,
    CHARITY_BURBAGE_LEDER_ID,
    SEVERUS_SNAPE_LEDER_ID,
} from '../src/data/mock/data/personas/personas'

import { test } from './utils/fixtures'
import { validerCLS } from './utils/cls-validering'
import { avkreftNarmesteleder } from './utils/user-actions'
import { expectIngenNarmesteleder, expectNarmesteleder, expectNarmestelederIkkeSynlig } from './utils/user-expects'

test.describe('Tester arbeidssituasjon', () => {
    test('fjerner lederen fra visningen etter 202 uten å hente listen på nytt', async ({ page }) => {
        let getAntall = 0
        await page.route('**/api/narmesteleder/linemanager/*', async (route) => {
            await route.fulfill({ status: 202 })
        })
        await page.route('**/api/narmesteleder/employee/linemanager*', async (route) => {
            getAntall++
            await route.continue()
        })
        await page.goto('/syk/sykefravaer?testperson=snart-slutt')
        await expectNarmesteleder(page, 'Albus Dumbledore')
        const getForAvkrefting = getAntall
        await page.getByRole('button', { name: 'Meld fra om endring' }).click()
        await avkreftNarmesteleder(page, ALBUS_DUMBLEDORE_LEDER_ID)
        await expectNarmestelederIkkeSynlig(page, 'Albus Dumbledore')
        await expectIngenNarmesteleder(page)
        expect(getAntall).toBe(getForAvkrefting)
    })

    test('viser registrert leder uten navn uten å tilby avkrefting', async ({ page }) => {
        await page.route('**/api/narmesteleder/employee/linemanager*', async (route) => {
            const response = await route.fetch()
            const data = await response.json()
            data.linemanagers = data.linemanagers.map((leder: { id: string; name: unknown }) =>
                leder.id === ALBUS_DUMBLEDORE_LEDER_ID ? { ...leder, name: null } : leder,
            )
            await route.fulfill({ response, json: data })
        })
        await page.goto('/syk/sykefravaer?testperson=snart-slutt')
        await expectIngenNarmesteleder(page)
        await expect(page.getByRole('button', { name: 'Meld fra om endring' })).toHaveCount(0)
        await expect(page.getByRole('dialog', { name: 'Endre nærmeste leder' })).toHaveCount(0)
    })

    test('Bruker med flere arbeidsgivere', async ({ page, getCLS }) => {
        await page.goto('/syk/sykefravaer?testperson=default')

        await page.getByRole('button', { name: 'Hogwarts School of Witchcraft and Wizardry' }).click()

        await expectNarmesteleder(page, 'Albus Dumbledore')
        await expect(page.getByRole('button', { name: 'Meld fra om endring' }).first()).toBeVisible()
        await page.getByRole('button', { name: 'Meld fra om endring' }).first().click()

        const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
        await expect(modal).toBeVisible()
        await expect(modal).toContainText('Albus Dumbledore')
        await avkreftNarmesteleder(page, ALBUS_DUMBLEDORE_LEDER_ID)

        await expect(modal).toBeHidden()
        await expectNarmestelederIkkeSynlig(page, 'Albus Dumbledore')

        await page.getByRole('button', { name: 'Diagon Alley' }).click()

        await expectNarmesteleder(page, 'Severus Snape')
        await expect(page.getByRole('button', { name: 'Meld fra om endring' }).first()).toBeVisible()
        await page.getByRole('button', { name: 'Meld fra om endring' }).first().click()

        const modal2 = page.getByRole('dialog', { name: 'Endre nærmeste leder' })

        await expect(modal2).toContainText('Endre nærmeste leder')
        await expect(modal2).toContainText('Severus Snape')
        await avkreftNarmesteleder(page, SEVERUS_SNAPE_LEDER_ID)

        await expect(modal2).toBeHidden()
        await expectNarmestelederIkkeSynlig(page, 'Severus Snape')

        await validerCLS(getCLS, 'arbeidsgiver accordion and modal')
    })

    test('Avkreft nærmeste leder feiler', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=default')

        const employer = page.getByRole('button', { name: 'Gloucester Cathedral' })
        await employer.click()

        await expectNarmesteleder(page, 'Charity Burbage')
        await expect(page.getByRole('button', { name: 'Meld fra om endring' }).first()).toBeVisible()
        await page.getByRole('button', { name: 'Meld fra om endring' }).first().click()

        const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
        await expect(modal).toContainText('Endre nærmeste leder')
        await expect(modal).toContainText('Charity Burbage')
        await avkreftNarmesteleder(page, CHARITY_BURBAGE_LEDER_ID)

        await expect(modal).toContainText('Beklager, det oppstod en feil!')
        await expect(modal).toBeVisible()

        const avbrytButton = modal.getByRole('button', { name: 'Avbryt' })
        await avbrytButton.click()

        await expect(modal).toBeHidden()
        await expect(employer).toBeVisible()
        await expectNarmesteleder(page, 'Charity Burbage')
    })

    test('Har narmesteleder og kan avkrefte den', async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=snart-slutt')

        const hovedInnhold = page.getByRole('main')
        await expect(hovedInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')

        await page.getByRole('button', { name: 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt' }).click()

        await expectNarmesteleder(page, 'Albus Dumbledore')

        await page.getByRole('button', { name: 'Meld fra om endring' }).click()

        await expect(
            page.getByText(
                'Arbeidsgiveren skal legge til rette for at du kan jobbe helt eller delvis selv om du er syk.',
            ),
        ).toBeVisible()
        await expect(page.getByText('Er det oppgaver jeg kan gjøre selv om jeg er syk?')).toBeVisible()
        await expect(page.getByText('Kan noe endres på arbeidsplassen for at jeg kan få det til?')).toBeVisible()

        const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
        await expect(modal).toContainText('Endre nærmeste leder')
        await expect(modal).toContainText('Albus Dumbledore')
        await avkreftNarmesteleder(page, ALBUS_DUMBLEDORE_LEDER_ID)

        await expect(modal).toBeHidden()

        await expectNarmestelederIkkeSynlig(page, 'Albus Dumbledore')
        await expectIngenNarmesteleder(page)
        await expect(hovedInnhold).toContainText('Hogwarts School of Witchcraft and Wizardry')
    })
})
