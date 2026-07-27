import { bundledEnv, isProdGcp } from './env'

const BASE_PATH = '/syk/sykefravaer'

export function isMockBackend() {
    return bundledEnv.NEXT_PUBLIC_MOCK_BACKEND
}

export function isOpplaering() {
    return bundledEnv.NEXT_PUBLIC_OPPLAERING
}

export function minSideUrl() {
    return bundledEnv.NEXT_PUBLIC_MINSIDE_URL
}

export function autofillEnabled() {
    return isMockBackend()
}

export function umamiEnabled() {
    return bundledEnv.NEXT_PUBLIC_UMAMI_ENABLED
}

export function sykepengesoknadUrl() {
    return bundledEnv.NEXT_PUBLIC_SYKEPENGESOKNAD_URL
}

export function spinnsynUrl() {
    return bundledEnv.NEXT_PUBLIC_SPINNSYN_URL
}

export function aktivitetsplanUrl() {
    return bundledEnv.NEXT_PUBLIC_AKTIVITETSPLAN_URL
}

export function oppfolgingsplanUrl() {
    return bundledEnv.NEXT_PUBLIC_OPPFOLGINGSPLAN_URL
}

export function dialogmoteUrl() {
    return bundledEnv.NEXT_PUBLIC_DIALOGMOTE_URL
}

export function telemetryCollectorURL(): string | undefined {
    return bundledEnv.NEXT_PUBLIC_TELEMETRY_URL ?? undefined
}

export function naisAppImage() {
    return bundledEnv.NEXT_PUBLIC_VERSION ?? undefined
}

export function naisAppName() {
    return bundledEnv.NEXT_PUBLIC_APP_NAME
}

export function basePath() {
    return BASE_PATH
}

export function isProd() {
    return isProdGcp
}
