import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
    { ignores: ['src/registerServiceWorker.js', 'src/**/__tests__/**'] },
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            'no-console': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/set-state-in-effect': 'warn',
            'react-hooks/refs': 'warn',
            'react-hooks/immutability': 'warn',
            'react-hooks/preserve-manual-memoization': 'warn',
        },
    },
    {
        files: ['playwright/**/*.{js,ts,tsx}'],
        rules: {
            'react-hooks/rules-of-hooks': 'off',
        },
    },
    {
        extends: [prettierRecommended],
        rules: {
            'prettier/prettier': 'warn',
        },
    },
])
