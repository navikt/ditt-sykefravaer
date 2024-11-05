import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test'

const PORT = process.env.PORT || 3000

type OptionsType = {
    baseURL: string
    timeout: number
    server: PlaywrightTestConfig['webServer'] | undefined
}

const createOptions = (): OptionsType => {
    const baseURL = `http://localhost:${PORT}`
    const timeout = process.env.CI ? 30 * 1000 : 120 * 2 * 1000

    if (process.env.CI) {
        const prebuild = false
        if (prebuild) {
            return {
                baseURL: `http://localhost:3000`,
                timeout: 30 * 1000,
                server: undefined,
            }
        }
        return {
            baseURL,
            timeout,
            server: {
                command: 'npm run dev-ingen-dekorator',
                port: 3000,
                timeout: 120 * 1000, // Wait up to 2 minutes for the server to start
                reuseExistingServer: false,
            },
        }
    }

    if (process.env.FAST) {
        return {
            baseURL,
            timeout: 30 * 1000,
            server: {
                command: 'yarn start:e2e', //TODO fikse en fast lokal
                url: baseURL,
                timeout: 120 * 1000,
                reuseExistingServer: false,
            },
        }
    }

    // Local dev server
    return {
        baseURL,
        timeout,
        server: {
            command: 'npm run dev-ingen-dekorator',
            port: 3000,
            timeout: 120 * 1000, // Wait up to 2 minutes for the server to start
            reuseExistingServer: true,
        },
    }
}

const opts = createOptions()

export default defineConfig({
    testDir: './playwright',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? 'blob' : 'html',
    use: {
        baseURL: opts.baseURL,
        navigationTimeout: 60000,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
    webServer: opts.server,
})
