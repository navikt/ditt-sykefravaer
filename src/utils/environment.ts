import getConfig from 'next/config'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

export function flexGatewayRoot() {
    return publicRuntimeConfig.flexGatewayRoot
}

export function isMockBackend() {
    return publicRuntimeConfig.mockBackend === 'true'
}

export function isOpplaering() {
    return publicRuntimeConfig.opplaering === 'true'
}

export function loginServiceUrl() {
    return serverRuntimeConfig.loginserviceUrl
}

export function loginServiceRedirectUrl() {
    return serverRuntimeConfig.loginServiceRedirectUrl
}

export function minSideUrl() {
    return publicRuntimeConfig.minSideUrl
}

export function amplitudeEnabled() {
    return publicRuntimeConfig.amplitudeEnabled === 'true'
}

export function syfoApiRoot() {
    return publicRuntimeConfig.syfoApiRoot
}

export function sykepengesoknadUrl() {
    return publicRuntimeConfig.sykepengesoknadUrl
}

export function spinnsynUrl() {
    return publicRuntimeConfig.spinnsynUrl
}

export function sykmeldingUrl() {
    return publicRuntimeConfig.sykmeldingUrl
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

export function snartSluttUrl() {
    return publicRuntimeConfig.snartSluttUrl
}
