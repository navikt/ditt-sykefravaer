import { test as base, expect } from '@playwright/test'
import './utils/custom-matchers'

export const test = base.extend({})

test.afterEach(async ({ page }) => {
    await expect(page).toHaveNoViolations()
})
