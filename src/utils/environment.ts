import getConfig from 'next/config'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

export const isDev = () => {
    return publicRuntimeConfig.environment === 'dev'
}

export const isQ1 = () => {
    return publicRuntimeConfig.environment === 'q1'
}

export function isProd() {
    return publicRuntimeConfig.environment === 'prod'
}

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

export function sykefravaerUrl() {
    return publicRuntimeConfig.sykefravaerUrl
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

export function narmestelederUrl() {
    return publicRuntimeConfig.narmestelederUrl
}

export function arbeidssokerregistreringUrl() {
    return publicRuntimeConfig.arbeidssokerregistreringUrl
}
