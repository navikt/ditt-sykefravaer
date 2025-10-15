// file: playwright/config/browser-config.ts
import { devices, type Project } from '@playwright/test'

// Extend Playwright's Project type to guarantee a name
export type NamedProject = Project & { name: string }

export function commonBrowserConfigs(opts: { baseURL: string }, optsMedDekorator: { baseURL: string }): NamedProject[] {
    return [
        {
            name: 'Desktop Chrome',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 },
                baseURL: opts.baseURL,
            },
            testIgnore: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Desktop Chrome med dekorator',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 },
                baseURL: optsMedDekorator.baseURL,
            },
            testMatch: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Mobile Chromium',
            use: {
                ...devices['Pixel 5'],
                viewport: { width: 375, height: 667 },
                isMobile: true,
                baseURL: opts.baseURL,
            },
            testIgnore: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Mobile Chromium med dekorator',
            use: {
                ...devices['Pixel 5'],
                viewport: { width: 375, height: 667 },
                isMobile: true,
                baseURL: optsMedDekorator.baseURL,
            },
            testMatch: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Desktop Firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: { width: 1920, height: 1080 },
                baseURL: opts.baseURL,
            },
            testIgnore: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Desktop Firefox med dekorator',
            use: {
                ...devices['Desktop Firefox'],
                viewport: { width: 1920, height: 1080 },
                baseURL: optsMedDekorator.baseURL,
            },
            testMatch: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Firefox (responsive)',
            use: {
                browserName: 'firefox',
                viewport: { width: 375, height: 667 },
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/40.0 Mobile/15E148 Safari/605.1.15',
                baseURL: opts.baseURL,
            },
            testIgnore: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Mobile Firefox med dekorator',
            use: {
                ...devices['Pixel 5'],
                viewport: { width: 375, height: 667 },
                isMobile: true,
                baseURL: optsMedDekorator.baseURL,
            },
            testMatch: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Desktop WebKit',
            use: {
                ...devices['Desktop Safari'],
                viewport: { width: 1920, height: 1080 },
                baseURL: opts.baseURL,
            },
            testIgnore: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Desktop WebKit med dekorator',
            use: {
                ...devices['Desktop Safari'],
                viewport: { width: 1920, height: 1080 },
                baseURL: optsMedDekorator.baseURL,
            },
            testMatch: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Mobile WebKit',
            use: {
                ...devices['iPhone 12'],
                viewport: { width: 375, height: 667 },
                isMobile: true,
                baseURL: opts.baseURL,
            },
            testIgnore: '**/brodsmuler.spec.ts',
        },
        {
            name: 'Mobile WebKit med dekorator',
            use: {
                ...devices['iPhone 12'],
                viewport: { width: 375, height: 667 },
                isMobile: true,
                baseURL: optsMedDekorator.baseURL,
            },
            testMatch: '**/brodsmuler.spec.ts',
        },
    ]
}

export function velgBrowserConfigs(
    configs: NamedProject[],
    filterFn: (config: NamedProject) => boolean,
): NamedProject[] {
    return configs.filter(filterFn)
}
