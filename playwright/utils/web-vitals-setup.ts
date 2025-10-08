import path from 'path'

import { Page } from '@playwright/test'

interface PerformanceMetric {
    name: string
    value: number
    id: string
    delta: number
    navigationType?: string
}

export async function measureCLSWithWebVitals(page: Page): Promise<number | null> {
    const webVitalsPath = path.resolve(__dirname, '../../node_modules/web-vitals/dist/web-vitals.iife.js')

    await page.addScriptTag({
        path: webVitalsPath,
    })

    await page.waitForTimeout(500)

    return await page.evaluate(async (): Promise<number | null> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any

        if (!win.webVitals || typeof win.webVitals.onCLS !== 'function') {
            return null
        }

        try {
            const { onCLS } = win.webVitals

            return new Promise<number | null>((resolve) => {
                let resolved = false
                let metricsReceived = false

                onCLS(
                    (metric: PerformanceMetric) => {
                        if (!resolved) {
                            metricsReceived = true
                            resolved = true
                            resolve(metric.value)
                        }
                    },
                    { reportAllChanges: true },
                )

                setTimeout(() => {
                    if (!resolved) {
                        const visibilityEvent = new Event('visibilitychange')
                        document.dispatchEvent(visibilityEvent)

                        const pagehideEvent = new Event('pagehide')
                        document.dispatchEvent(pagehideEvent)
                    }
                }, 1000)

                setTimeout(() => {
                    if (!resolved) {
                        resolved = true
                        resolve(metricsReceived ? 0 : 0)
                    }
                }, 4000)
            })
        } catch (e) {
            return null
        }
    })
}
