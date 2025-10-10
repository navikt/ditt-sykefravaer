import path from 'path'

import { Page } from '@playwright/test'

interface PerformanceMetric {
    name: string
    value: number
    id: string
    delta: number
    navigationType?: string
}

export async function measureCLSWithWebVitals(page: Page): Promise<void> {
    const webVitalsPath = path.resolve(__dirname, '../../node_modules/web-vitals/dist/web-vitals.iife.js')

    await page.addScriptTag({
        path: webVitalsPath,
    })

    await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any

        if (win.webVitals && typeof win.webVitals.onCLS === 'function') {
            win._clsValues = []

            win.webVitals.onCLS(
                (metric: PerformanceMetric) => {
                    win._clsValues.push(metric.value)
                },
                { reportAllChanges: true },
            )
        }
    })
}

export async function getCLSValue(page: Page): Promise<number | null> {
    await page.evaluate(() => {
        const visibilityEvent = new Event('visibilitychange')
        document.dispatchEvent(visibilityEvent)

        const pagehideEvent = new Event('pagehide')
        document.dispatchEvent(pagehideEvent)
    })

    await page.waitForTimeout(500)

    return await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any
        const values = win._clsValues || []
        return values.length > 0 ? values[values.length - 1] : 0
    })
}
