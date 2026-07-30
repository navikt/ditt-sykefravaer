import { defineConfig } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import playwrightPlugin from 'eslint-plugin-playwright'
import { flatConfig as nextFlatConfig } from '@next/eslint-plugin-next'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import tseslint from 'typescript-eslint'
import tsmEslintReact from '@navikt/tsm-eslint-react'

export default defineConfig([
    { ignores: ['src/registerServiceWorker.js', 'src/**/__tests__/**'] },
    nextFlatConfig.coreWebVitals,
    {
        plugins: {
            import: importPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            'testing-library': testingLibraryPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    ...tseslint.configs.recommended,
    ...tsmEslintReact,
    eslintPluginPrettierRecommended,
    {
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            'prettier/prettier': 'warn',
        },
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    {
        files: ['playwright/**/*.{js,ts,tsx}'],
        ...playwrightPlugin.configs['flat/recommended'],
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
])
