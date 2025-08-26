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
