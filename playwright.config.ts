import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './playwright',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? 'blob' : 'html',
    use: {
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
    webServer: {
        command: 'npm run dev-ingen-dekorator',
        port: 8080,
        timeout: 120 * 1000, // Wait up to 2 minutes for the server to start
        reuseExistingServer: !process.env.CI,
    },
})
