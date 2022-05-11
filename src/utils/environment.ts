import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

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
    return publicRuntimeConfig.loginserviceUrl
}

export function loginServiceRedirectUrl() {
    return publicRuntimeConfig.loginServiceRedirectUrl
}

export function dittNavUrl() {
    return publicRuntimeConfig.dittNavUrl
}

export function amplitudeKey() {
    return publicRuntimeConfig.amplitudeKey
}

export function amplitudeEnabled() {
    return publicRuntimeConfig.amplitudeEnabled === 'true'
}

export function spinnsynFrontendInterne() {
    return publicRuntimeConfig.spinnsynFrontendInterne === 'true'
}

export function sykmeldingerBackendProxyRoot() {
    return publicRuntimeConfig.sykmeldingerBackendProxyRoot
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

export function newDialogmoteUrl() {
    return publicRuntimeConfig.newDialogmoteUrl
}

export function narmestelederUrl() {
    return publicRuntimeConfig.narmestelederUrl
}

export function backendSoknadApp() {
    return publicRuntimeConfig.backendSoknadApp
}

export function snartSluttUrl() {
    return publicRuntimeConfig.snartSluttUrl
}
