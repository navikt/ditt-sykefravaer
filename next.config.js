/* eslint-disable @typescript-eslint/no-var-requires */
const withLess = require('next-with-less')
const { withSentryConfig } = require('@sentry/nextjs')
const withPlugins = require('next-compose-plugins')

const csp = {
    'default-src': ["'none'"],
    'connect-src': [
        "'self'",
        'https://*.nav.no',
        'https://www.google-analytics.com',
        'https://nav.psplugin.com',
        'https://ta-survey-v2.herokuapp.com',
    ],
    'img-src': [
        "'self'",
        'data:',
        'https://*.nav.no',
        'https://www.google-analytics.com',
    ],
    'font-src': ["'self'", 'data:', 'https://*.psplugin.com'],
    'frame-src': ["'self'", 'data:', 'https://vars.hotjar.com'],
    'worker-src': ['blob:', '*.nais.io'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://*.nav.no'],
    'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://*.nav.no',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://static.hotjar.com',
        'https://script.hotjar.com',
        'https://in2.taskanalytics.com',
        'https://account.psplugin.com',
    ],
}

const cspString = Object.entries(csp)
    .map((entry) => `${entry[0]} ${entry[1].join(' ')}`)
    .join('; ')

const cspHeader = [
    {
        key: 'Content-Security-Policy-Report-Only',
        value: cspString,
    },
]

module.exports = withPlugins(
    [
        [withLess],
        [
            (nextConfig) =>
                process.env.ENABLE_SENTRY
                    ? withSentryConfig(nextConfig, {
                          silent: true,
                      })
                    : nextConfig,
        ],
    ],
    {
        async headers() {
            return [
                {
                    source: '/:path*',
                    headers: cspHeader,
                },
            ]
        },
        basePath: '/syk/sykefravaer',
        lessLoaderOptions: {},
        assetPrefix: process.env.ASSET_PREFIX || '',
        generateEtags: false, //Disabler etag i pages
        serverRuntimeConfig: {
            // Will only be available on the server side
            decoratorEnv: process.env.DECORATOR_ENV,
            decoratorUrl: process.env.DECORATOR_URL,
            noDecorator: process.env.NO_DECORATOR,
        },
        publicRuntimeConfig: {
            // Will be available on both server and client
            loginserviceUrl: process.env.LOGINSERVICE_URL,
            loginServiceRedirectUrl: process.env.LOGINSERVICE_REDIRECT_URL,
            loginserviceIdportenDiscoveryUrl:
                process.env.LOGINSERVICE_IDPORTEN_DISCOVERY_URL,
            loginserviceIdportenAudience:
                process.env.LOGINSERVICE_IDPORTEN_AUDIENCE,
            flexGatewayRoot: process.env.FLEX_GATEWAY_ROOT,
            mockBackend: process.env.MOCK_BACKEND,
            opplaering: process.env.OPPLAERING,
            sykefravaerUrl: process.env.SYKEFRAVAER_URL,
            dittNavUrl: process.env.DITTNAV_URL,
            amplitudeEnabled: process.env.AMPLITUDE_ENABLED,
            environment: process.env.ENVIRONMENT,
            spinnsynFrontendInterne: process.env.SPINNSYN_FRONTEND_INTERNE,
            sykmeldingerBackendProxyRoot:
                process.env.SYKMELDINGER_BACKEND_PROXY_ROOT,
            syfoApiRoot: process.env.SYFOAPI_ROOT,
            sykepengesoknadUrl: process.env.SYKEPENGESOKNAD_URL,
            spinnsynUrl: process.env.SPINNSYN_URL,
            sykmeldingUrl: process.env.SYKMELDING_URL,
            aktivitetsplanUrl: process.env.AKTIVITETSPLAN_URL,
            oppfolgingsplanUrl: process.env.OPPFOLGINGSPLAN_URL,
            dialogmoteUrl: process.env.DIALOGMOTE_URL,
            newDialogmoteUrl: process.env.NEW_DIALOGMOTE_URL,
            narmestelederUrl: process.env.NARMESTELEDER_URL,
            backendSoknadApp: process.env.BACKEND_SOKNAD_APP,
            snartSluttUrl: process.env.SNART_SLUTT_URL,
        },
    }
)
