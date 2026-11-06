import { expect } from '@playwright/test'

import {
    ALBUS_DUMBLEDORE_LEDER_ID,
    CHARITY_BURBAGE_LEDER_ID,
    SEVERUS_SNAPE_LEDER_ID,
} from '../src/data/mock/data/personas/personas'
import { Linemanager } from '../src/types/narmesteLeder'

import { test } from './utils/fixtures'
import { validerCLS } from './utils/cls-validering'
import { avkreftNarmesteleder } from './utils/user-actions'
import { expectIngenNarmesteleder, expectNarmesteleder, expectNarmestelederIkkeSynlig } from './utils/user-expects'

test.describe('Tester arbeidssituasjon', () => {
    for (const getFeiler of [false, true]) {
        test(
            getFeiler
                ? 'viser ventestatus når oppfølgende GET feiler'
                : 'viser ventestatus når oppfølgende GET er utdatert',
            async ({ page }) => {
                let avkreftet = false
                let oppfolginger = 0
                let opprinnelig: unknown
                await page.route('**/api/narmesteleder/linemanager/*', async (route) => {
                    avkreftet = true
                    await route.fulfill({ status: 202 })
                })
                await page.route('**/api/narmesteleder/employee/linemanager*', async (route) => {
                    if (!avkreftet) {
                        const response = await route.fetch()
                        opprinnelig = await response.json()
                        await route.fulfill({ response, json: opprinnelig })
                        return
                    }
                    oppfolginger++
                    if (getFeiler) {
                        await route.fulfill({ status: 500 })
                    } else {
                        await route.fulfill({ status: 200, json: opprinnelig })
                    }
                })
                await page.goto('/syk/sykefravaer?testperson=default')
                await page.getByRole('button', { name: 'Hogwarts School of Witchcraft and Wizardry' }).click()
                await expectNarmesteleder(page, 'Albus Dumbledore')
                await page.getByRole('button', { name: 'Meld fra om endring' }).first().click()
                await avkreftNarmesteleder(page, ALBUS_DUMBLEDORE_LEDER_ID)
                const ventemelding = page.getByText(
                    'Vi har bedt om å fjerne en nærmeste leder. Vi kan ikke bekrefte at endringen er fullført ennå.',
                )
                await expect(ventemelding).toBeVisible()
                await expect.poll(() => oppfolginger, { timeout: 15000 }).toBe(3)
                await page.getByRole('button', { name: 'Diagon Alley' }).click()
                await expectNarmesteleder(page, 'Severus Snape')
                await expect(ventemelding).toHaveCount(1)
            },
        )
    }

    for (const annenLederFraStart of [true, false]) {
        test(
            annenLederFraStart
                ? 'lukker dialogen når en annen leder allerede finnes'
                : 'åpner ikke dialogen når en annen leder kommer senere',
            async ({ page }) => {
                let avkreftet = false
                await page.route('**/api/narmesteleder/linemanager/*', async (route) => {
                    avkreftet = true
                    await route.fulfill({ status: 202 })
                })
                await page.route('**/api/narmesteleder/employee/linemanager*', async (route) => {
                    const response = await route.fetch()
                    const data = await response.json()
                    const forste = data.linemanagers.find(
                        (leder: Linemanager) => leder.id === ALBUS_DUMBLEDORE_LEDER_ID,
                    )
                    expect(forste).toBeDefined()
                    const andre = {
                        ...forste,
                        id: '00000000-0000-4000-8000-000000000099',
                        name: { firstName: 'Minerva', middleName: null, lastName: 'McGonagall' },
                    }
                    await route.fulfill({
                        response,
                        json: { linemanagers: avkreftet ? [andre] : annenLederFraStart ? [forste, andre] : [forste] },
                    })
                })

                await page.goto('/syk/sykefravaer?testperson=snart-slutt')
                await expectNarmesteleder(page, 'Albus Dumbledore')
                const endre = page.getByRole('button', { name: 'Meld fra om endring' })
                await endre.focus()
                await page.keyboard.press('Enter')
                const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
                await expect(modal).toContainText('Albus Dumbledore')
                await avkreftNarmesteleder(page, ALBUS_DUMBLEDORE_LEDER_ID)
                await expectNarmesteleder(page, 'Minerva McGonagall')
                await expect(modal).toBeHidden()
                await endre.click()
                await expect(modal).toContainText('Minerva McGonagall')
                await expect(modal.getByRole('button', { name: 'Ja, jeg er sikker' })).toBeEnabled()
                await page.keyboard.press('Escape')
                await expect(modal).toBeHidden()
            },
        )
    }

    test('viser registrert leder uten navn og lar brukeren melde fra om endring', async ({ page }) => {
        await page.route('**/api/narmesteleder/employee/linemanager*', async (route) => {
            const response = await route.fetch()
            const data = await response.json()
            data.linemanagers = data.linemanagers.map((leder: { id: string; name: unknown }) =>
                leder.id === ALBUS_DUMBLEDORE_LEDER_ID ? { ...leder, name: null } : leder,
            )
            await route.fulfill({ response, json: data })
        })
        await page.goto('/syk/sykefravaer?testperson=snart-slutt')
        await expect(
            page.getByText('Arbeidsgiveren din har registrert en nærmeste leder, men navnet er ikke tilgjengelig.'),
        ).toBeVisible()
        await page.getByRole('button', { name: 'Meld fra om endring' }).click()
        const modal = page.getByRole('dialog', { name: 'Endre nærmeste leder' })
        await expect(modal).toContainText('Er du sikker på at du vil fjerne den registrerte nærmeste lederen din')
        await avkreftNarmesteleder(page, ALBUS_DUMBLEDORE_LEDER_ID)
        await expect(modal).toBeHidden()
        await expectIngenNarmesteleder(page)
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
