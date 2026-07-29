import { defineConfig } from 'eslint/config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
})

export default defineConfig([
    { ignores: ['src/registerServiceWorker.js', 'src/**/__tests__/**'] },
    ...compat.config({
        extends: ['@navikt/eslint-config-teamsykmelding', 'next/core-web-vitals'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    }),
    ...compat.config({
        overrides: [
            {
                files: ['playwright/**/*.{js,ts,tsx}'],
                extends: ['plugin:playwright/recommended'],
                rules: {
                    'testing-library/prefer-screen-queries': 'off',
                    'playwright/require-top-level-describe': 'error',
                    'playwright/expect-expect': 'off',
                },
            },
            {
                files: ['playwright/utils/**/*.{js,ts,tsx}'],
                rules: {
                    'playwright/require-top-level-describe': 'off',
                },
            },
        ],
    }),
])
