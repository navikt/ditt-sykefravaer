import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test'

type OptionsType = {
    baseURL: string
    timeout: number
    server: PlaywrightTestConfig['webServer'] | undefined
}

type WebServerConfig = NonNullable<PlaywrightTestConfig['webServer']>

const createOptions = (medDekorator = false, port = 3000): OptionsType => {
    const timeout = process.env.CI ? 30 * 1000 : 120 * 2 * 1000

    const baseURL = `http://localhost:${port}`
    if (process.env.CI) {
        return {
            baseURL,
            timeout: 30 * 1000,
            server: undefined,
        }
    }

    if (process.env.FAST) {
        return {
            baseURL,
            timeout: 30 * 1000,
            server: {
                command: 'npm run start',
                port,
                timeout: 120 * 1000,
                reuseExistingServer: false,
                stderr: 'pipe',
                stdout: 'pipe',
            },
        }
    }

    // Lokal dev server
    const baseEnv = { ...process.env }
    if (medDekorator) {
        delete baseEnv.NO_DECORATOR
    } else {
        baseEnv.NO_DECORATOR = 'true'
    }

    return {
        baseURL,
        timeout,
        server: {
            command: medDekorator
                ? 'MOCK_BACKEND=true next dev -p ' + port + ' | pino-pretty'
                : 'MOCK_BACKEND=true NO_DECORATOR=true next dev -p ' + port + ' | pino-pretty',
            port,
            timeout: 120 * 1000, // Vent opptil 2 minutter for at serveren skal starte
            reuseExistingServer: true,
            env: baseEnv as Record<string, string>,
        },
    }
}

const opts = createOptions(false, 3000)
const optsMedDekorator = createOptions(true, 3001)

// Bygg webServer array bare hvis servere eksisterer
const webServere = []
if (opts.server && !Array.isArray(opts.server)) webServere.push(opts.server)
if (optsMedDekorator.server && !Array.isArray(optsMedDekorator.server)) webServere.push(optsMedDekorator.server)

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
            testIgnore: '**/brodsmuler.spec.ts',
        },
        {
            name: 'brodsmuler-med-dekorator',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: optsMedDekorator.baseURL,
            },
            testMatch: '**/brodsmuler.spec.ts',
        },
        ...(process.env.CI
            ? [
                  {
                      name: 'firefox',
                      use: { ...devices['Desktop Firefox'] },
                      testIgnore: '**/brodsmuler.spec.ts',
                  },
              ]
            : []),
    ],
    webServer: webServere as WebServerConfig,
})
