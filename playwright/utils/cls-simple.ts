import { expect } from '@playwright/test'

export async function validerCLS(getCLS: () => Promise<number | null>, testNavn?: string): Promise<void> {
    const cls = await getCLS()

    if (cls === null) {
        expect.soft(false, `CLS measurement failed${testNavn ? ` in test: ${testNavn}` : ''}`).toBe(true)
        return
    }

    expect.soft(cls, `CLS score too high${testNavn ? ` in ${testNavn}` : ''}: ${cls}`).toBeLessThanOrEqual(0.1)
}
