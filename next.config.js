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
        const csp = await buildCspHeader(appDirectives, { env: process.env.ENVIRONMENT })

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
    assetPrefix: process.env.ASSET_PREFIX || undefined,
    transpilePackages: ['filter-obj', 'query-string'],
    serverRuntimeConfig: {
        // Will only be available on the server side
        decoratorEnv: process.env.DECORATOR_ENV,
        noDecorator: process.env.NO_DECORATOR,
        dittSykefravaerBackendClientId: process.env.DITT_SYKEFRAVAER_BACKEND_CLIENT_ID,
        spinnsynBackendClientId: process.env.SPINNSYN_BACKEND_CLIENT_ID,
        flexSykmeldingerBackendClientId: process.env.FLEX_SYKMELDINGER_BACKEND_CLIENT_ID,
        sykepengesoknadBackendClientId: process.env.SYKEPENGESOKNAD_BACKEND_CLIENT_ID,
        narmestelederClientId: process.env.NARMESTELEDER_CLIENT_ID,
        flexjarBackendClientId: process.env.FLEXJAR_BACKEND_CLIENT_ID,
        syfomotebehovClientId: process.env.SYFOMOTEBEHOV_CLIENT_ID,
        veilarboppfolgingHost: process.env.VEILARBOPPFOLGING_HOST,
        veilarboppfolgingClientId: process.env.VEILARBOPPFOLGING_CLIENT_ID,
        syfooppfolgingsplanserviceHost: process.env.SYFOOPPFOLGINGSPLANSERVICE_HOST,
        syfooppfolgingsplanserviceClientId: process.env.SYFOOPPFOLGINGSPLANSERVICE_CLIENT_ID,
        sykepengedagerInformasjonClientId: process.env.SYKEPENGEDAGER_INFORMASJON_CLIENT_ID,
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        basePath: '/syk/sykefravaer',
        mockBackend: process.env.MOCK_BACKEND,
        opplaering: process.env.OPPLAERING,
        sykefravaerUrl: process.env.SYKEFRAVAER_URL,
        minSideUrl: process.env.MINSIDE_URL,
        amplitudeEnabled: process.env.AMPLITUDE_ENABLED,
        environment: process.env.ENVIRONMENT,
        spinnsynFrontendInterne: process.env.SPINNSYN_FRONTEND_INTERNE,
        sykepengesoknadUrl: process.env.SYKEPENGESOKNAD_URL,
        spinnsynUrl: process.env.SPINNSYN_URL,
        tsmSykmeldingUrl: process.env.TSM_SYKMELDING_URL,
        aktivitetsplanUrl: process.env.AKTIVITETSPLAN_URL,
        oppfolgingsplanUrl: process.env.OPPFOLGINGSPLAN_URL,
        dialogmoteUrl: process.env.DIALOGMOTE_URL,
        telemetryCollectorURL: process.env.NAIS_FRONTEND_TELEMETRY_COLLECTOR_URL,
        naisAppImage: process.env.NAIS_APP_IMAGE,
        naisAppName: process.env.NAIS_APP_NAME,
    },
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
