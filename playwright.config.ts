import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// export default defineConfig({
//     testDir: './playwright',
//     timeout: 30000, // Global timeout for all tests (30 seconds)
//     /* Run tests in files in parallel */
//     fullyParallel: true,
//     /* Fail the build on CI if you accidentally left test.only in the source code. */
//     forbidOnly: !!process.env.CI,
//     /* Retry on CI only */
//     retries: process.env.CI ? 2 : 0,
//     /* Opt out of parallel tests on CI. */
//     workers: process.env.CI ? 1 : undefined,
//     /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//     reporter: 'html',
//     /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//     use: {
//         navigationTimeout: 60000, // Navigation-specific timeout (60 seconds)
//
//         /* Base URL to use in actions like `await page.goto('/')`. */
//         // baseURL: 'http://127.0.0.1:3000',
//
//         /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//         trace: 'on-first-retry',
//     },
//
//     /* Configure projects for major browsers */
//     projects: [
//         {
//             name: 'chromium',
//             use: { ...devices['Desktop Chrome'] },
//         },
//
//         // {
//         //   name: 'firefox',
//         //   use: { ...devices['Desktop Firefox'] },
//         // },
//         //
//         // {
//         //   name: 'webkit',
//         //   use: { ...devices['Desktop Safari'] },
//         // },
//
//         /* Test against mobile viewports. */
//         // {
//         //   name: 'Mobile Chrome',
//         //   use: { ...devices['Pixel 5'] },
//         // },
//         // {
//         //   name: 'Mobile Safari',
//         //   use: { ...devices['iPhone 12'] },
//         // },
//
//         /* Test against branded browsers. */
//         // {
//         //   name: 'Microsoft Edge',
//         //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
//         // },
//         // {
//         //   name: 'Google Chrome',
//         //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//         // },
//     ],
//
//     /* Run your local dev server before starting the tests */
//     // webServer: {
//     //   command: 'npm run start',
//     //   url: 'http://127.0.0.1:3000',
//     //   reuseExistingServer: !process.env.CI,
//     // },
// })

export default defineConfig({
    testDir: './playwright',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        navigationTimeout: 60000,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    // Add the webServer configuration
    webServer: {
        command: 'npm run dev-ingen-dekorator',
        port: 8080,
        timeout: 120 * 1000, // Wait up to 2 minutes for the server to start
        reuseExistingServer: !process.env.CI,
    },
})
