/* eslint-disable @typescript-eslint/no-var-requires */
const { buildCspHeader } = require('@navikt/nav-dekoratoren-moduler/ssr')

const appDirectives = {
    'connect-src': ["'self'", '*.uxsignals.com'],
    'font-src': ['https://fonts.gstatic.com'],
    'object-src': ['none'],
    'script-src': ['uxsignals-frontend.uxsignals.app.iterate.no', 'navtest.boost.ai'],
    'script-src-elem': ["'self'", 'navtest.boost.ai', 'uxsignals-frontend.uxsignals.app.iterate.no'],
    'style-src-elem': ["'self'"],
    'img-src': ["'self'"],
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/:sykmeldingId/pdf',
                destination: '/api/generate-pdf/:sykmeldingId',
            },
        ]
    },
    async headers() {
        const csp = await buildCspHeader(appDirectives, { env: process.env.NEXT_PUBLIC_DECORATOR_ENV })

        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: csp,
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'no-referrer',
                    },
                ],
            },
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'private, no-cache, no-store, max-age=0, must-revalidate',
                    },
                ],
            },
        ]
    },
    basePath: '/syk/sykefravaer',
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
    transpilePackages: ['filter-obj', 'query-string'],
    async redirects() {
        return [
            {
                basePath: false,
                source: '/syk/sykmeldinger',
                destination: '/syk/sykefravaer/sykmeldinger',
                permanent: true,
            },
            {
                basePath: false,
                source: '/syk/sykmeldinger/:sykmeldingId',
                destination: '/syk/sykefravaer/sykmeldinger/:sykmeldingId',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
