import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export function isMockBackend() {
    return publicRuntimeConfig.mockBackend === 'true'
}

export function isOpplaering() {
    return publicRuntimeConfig.opplaering === 'true'
}

export function minSideUrl() {
    return publicRuntimeConfig.minSideUrl
}

export function autofillEnabled() {
    return isMockBackend()
}

export function amplitudeEnabled() {
    return publicRuntimeConfig.amplitudeEnabled === 'true'
}

export function sykepengesoknadUrl() {
    return publicRuntimeConfig.sykepengesoknadUrl
}

export function spinnsynUrl() {
    return publicRuntimeConfig.spinnsynUrl
}

export function aktivitetsplanUrl() {
    return publicRuntimeConfig.aktivitetsplanUrl
}

export function oppfolgingsplanUrl() {
    return publicRuntimeConfig.oppfolgingsplanUrl
}

export function dialogmoteUrl() {
    return publicRuntimeConfig.dialogmoteUrl
}
export function telemetryCollectorURL() {
    return publicRuntimeConfig.telemetryCollectorURL
}

export function naisAppImage() {
    return publicRuntimeConfig.naisAppImage
}

export function naisAppName() {
    return publicRuntimeConfig.naisAppName
}

export function basePath() {
    return publicRuntimeConfig.basePath
}

export function isProd() {
    return publicRuntimeConfig.env === 'prod'
}
