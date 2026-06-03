import './custom-matchers'
import { expect, Locator, Page } from '@playwright/test'

type ByRoleOptions = Parameters<Page['getByRole']>['1']

export function getRadioInGroup(page: Page | Locator) {
    return (group: ByRoleOptions, radio: ByRoleOptions) => page.getByRole('group', group).getByRole('radio', radio)
}

export function getCheckboxInGroup(page: Page) {
    return (group: ByRoleOptions, checkbox: ByRoleOptions) =>
        page.getByRole('group', group).getByRole('checkbox', checkbox)
}

type CurriedAction = (page: Page) => Promise<void>

export function userInteractionsGroup(...actions: CurriedAction[]) {
    return async (page: Page): Promise<void> => {
        for (const action of actions) {
            await action(page)
        }
    }
}

export async function harSynligOverskrift(page: Page, tittelTekst: string, level: number, exact: boolean = false) {
    const locator = page.getByRole('heading', { level, name: tittelTekst, exact: exact })
    await expect(locator).toBeVisible()
    return locator
}

export async function harSynligTekst(page: Page, tekst: string | RegExp) {
    const locator = page.getByText(tekst)
    await expect(locator).toBeVisible()
    return locator
}

export async function apneReadmore(page: Page, tittel: string, forventetTekst: string[] = []) {
    await page.getByRole('button', { name: tittel }).click()

    for (const tekst of forventetTekst) {
        await expect(page.getByText(tekst)).toBeVisible()
    }
}
