import * as z from 'zod'

const BoolString = z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true')

// ──────────────────────────────────────────────────────────────────────────────
// Bundled (build-time) miljøvariabler
//
// Alle variabler med NEXT_PUBLIC_-prefiks bakes inn i klient-bundelen av
// Next.js ved byggetidspunktet. Disse er tilgjengelige både på server og klient.
//
// Valideringen kjører ved modulinnlasting og feiler TIDLIG (ved bygging)
// dersom påkrevde variabler mangler.
// ──────────────────────────────────────────────────────────────────────────────

const BundledEnvSchema = z.object({
    NEXT_PUBLIC_RUNTIME_ENV: z.enum(['demo', 'dev-gcp', 'prod-gcp']),
    NEXT_PUBLIC_MOCK_BACKEND: BoolString,
    NEXT_PUBLIC_OPPLAERING: BoolString,
    NEXT_PUBLIC_UMAMI_ENABLED: BoolString,
    NEXT_PUBLIC_SYKEPENGESOKNAD_URL: z.string().url(),
    NEXT_PUBLIC_SPINNSYN_URL: z.string().url(),
    NEXT_PUBLIC_AKTIVITETSPLAN_URL: z.string().url(),
    NEXT_PUBLIC_OPPFOLGINGSPLAN_URL: z.string().url(),
    NEXT_PUBLIC_DIALOGMOTE_URL: z.string().url(),
    NEXT_PUBLIC_MINSIDE_URL: z.string().url(),
    NEXT_PUBLIC_TELEMETRY_URL: z.string().url().nullish(),
    NEXT_PUBLIC_APP_NAME: z.string().default('ditt-sykefravaer'),
    NEXT_PUBLIC_VERSION: z.string().nullish(),
})

export type BundledEnv = z.infer<typeof BundledEnvSchema>

export const bundledEnv: BundledEnv = BundledEnvSchema.parse({
    NEXT_PUBLIC_RUNTIME_ENV: process.env.NEXT_PUBLIC_RUNTIME_ENV,
    NEXT_PUBLIC_MOCK_BACKEND: process.env.NEXT_PUBLIC_MOCK_BACKEND,
    NEXT_PUBLIC_OPPLAERING: process.env.NEXT_PUBLIC_OPPLAERING,
    NEXT_PUBLIC_UMAMI_ENABLED: process.env.NEXT_PUBLIC_UMAMI_ENABLED,
    NEXT_PUBLIC_SYKEPENGESOKNAD_URL: process.env.NEXT_PUBLIC_SYKEPENGESOKNAD_URL,
    NEXT_PUBLIC_SPINNSYN_URL: process.env.NEXT_PUBLIC_SPINNSYN_URL,
    NEXT_PUBLIC_AKTIVITETSPLAN_URL: process.env.NEXT_PUBLIC_AKTIVITETSPLAN_URL,
    NEXT_PUBLIC_OPPFOLGINGSPLAN_URL: process.env.NEXT_PUBLIC_OPPFOLGINGSPLAN_URL,
    NEXT_PUBLIC_DIALOGMOTE_URL: process.env.NEXT_PUBLIC_DIALOGMOTE_URL,
    NEXT_PUBLIC_MINSIDE_URL: process.env.NEXT_PUBLIC_MINSIDE_URL,
    NEXT_PUBLIC_TELEMETRY_URL: process.env.NEXT_PUBLIC_TELEMETRY_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
} satisfies Record<keyof BundledEnv, unknown>)

// ──────────────────────────────────────────────────────────────────────────────
// Server-only miljøvariabler
//
// Disse er kun tilgjengelige på serveren og leses ved kjøretid.
// getServerEnv() er lazy — kall den kun i server-side-kode (API-ruter, GSP).
// Valideres ved oppstart via /api/internal/isReady-endepunktet.
// ──────────────────────────────────────────────────────────────────────────────

const ServerEnvSchema = z.object({
    NEXT_PUBLIC_DECORATOR_ENV: z.enum(['dev', 'prod']),
    NO_DECORATOR: z.string().optional(),
    DITT_SYKEFRAVAER_BACKEND_CLIENT_ID: z.string().min(1),
    SPINNSYN_BACKEND_CLIENT_ID: z.string().min(1),
    FLEX_SYKMELDINGER_BACKEND_CLIENT_ID: z.string().min(1),
    SYKEPENGESOKNAD_BACKEND_CLIENT_ID: z.string().min(1),
    NARMESTELEDER_CLIENT_ID: z.string().min(1),
    FLEXJAR_BACKEND_CLIENT_ID: z.string().min(1),
    SYFOMOTEBEHOV_CLIENT_ID: z.string().min(1),
    VEILARBOPPFOLGING_HOST: z.string().min(1),
    VEILARBOPPFOLGING_CLIENT_ID: z.string().min(1),
    SYKEPENGEDAGER_INFORMASJON_CLIENT_ID: z.string().min(1),
    UNLEASH_SERVER_API_URL: z.string().url(),
    UNLEASH_SERVER_API_TOKEN: z.string().min(1),
})

export type ServerEnv = z.infer<typeof ServerEnvSchema>

export function getServerEnv(): ServerEnv {
    return ServerEnvSchema.parse({
        NEXT_PUBLIC_DECORATOR_ENV: process.env.NEXT_PUBLIC_DECORATOR_ENV,
        NO_DECORATOR: process.env.NO_DECORATOR,
        DITT_SYKEFRAVAER_BACKEND_CLIENT_ID: process.env.DITT_SYKEFRAVAER_BACKEND_CLIENT_ID,
        SPINNSYN_BACKEND_CLIENT_ID: process.env.SPINNSYN_BACKEND_CLIENT_ID,
        FLEX_SYKMELDINGER_BACKEND_CLIENT_ID: process.env.FLEX_SYKMELDINGER_BACKEND_CLIENT_ID,
        SYKEPENGESOKNAD_BACKEND_CLIENT_ID: process.env.SYKEPENGESOKNAD_BACKEND_CLIENT_ID,
        NARMESTELEDER_CLIENT_ID: process.env.NARMESTELEDER_CLIENT_ID,
        FLEXJAR_BACKEND_CLIENT_ID: process.env.FLEXJAR_BACKEND_CLIENT_ID,
        SYFOMOTEBEHOV_CLIENT_ID: process.env.SYFOMOTEBEHOV_CLIENT_ID,
        VEILARBOPPFOLGING_HOST: process.env.VEILARBOPPFOLGING_HOST,
        VEILARBOPPFOLGING_CLIENT_ID: process.env.VEILARBOPPFOLGING_CLIENT_ID,
        SYKEPENGEDAGER_INFORMASJON_CLIENT_ID: process.env.SYKEPENGEDAGER_INFORMASJON_CLIENT_ID,
        UNLEASH_SERVER_API_URL: process.env.UNLEASH_SERVER_API_URL,
        UNLEASH_SERVER_API_TOKEN: process.env.UNLEASH_SERVER_API_TOKEN,
    } satisfies Record<keyof ServerEnv, unknown>)
}
