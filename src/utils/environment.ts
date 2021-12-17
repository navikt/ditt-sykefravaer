interface EnvironmentInterface {
    isMockBackend(): boolean
    isQ1(): boolean
    isOpplaering(): boolean
    isProd(): boolean
    sykmeldingerBackendProxyRoot(): string
    flexGatewayRoot(): string
    syfoApiRoot(): string
    loginServiceUrl(): string
    loginServiceRedirectUrl(): string
    sykepengesoknadUrl(): string
    spinnsynUrl(): string
    sykmeldingUrl(): string
    aktivitetsplanUrl(): string
    oppfolgingsplanUrl(): string
    dialogmoteUrl(): string
    dittNavUrl(): string
    sykepengerDokumenterUrl(): string
    frontendloggerRoot(): string
    narmestelederUrl(): string
    arbeidssokerregistreringUrl(): string
    amplitudeEnabled(): boolean
    amplitudeKey(): string
}

class Environment implements EnvironmentInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private env = (window as any)._env_;

    isMockBackend() {
        return this.env.MOCK_BACKEND === 'true'
    }

    isQ1() {
        return this.env.ENVIRONMENT === 'q1'
    }

    isOpplaering() {
        return this.env.OPPLAERING === 'true'
    }

    isProd() {
        return this.env.ENVIRONMENT === 'prod'
    }

    sykmeldingerBackendProxyRoot() {
        return this.env.SYKMELDINGER_BACKEND_PROXY_ROOT
    }

    flexGatewayRoot() {
        return this.env.FLEX_GATEWAY_ROOT
    }

    syfoApiRoot() {
        return this.env.SYFOAPI_ROOT
    }

    loginServiceUrl() {
        return this.env.LOGINSERVICE_URL
    }

    loginServiceRedirectUrl() {
        return this.env.LOGINSERVICE_REDIRECT_URL
    }

    sykepengesoknadUrl() {
        return this.env.SYKEPENGESOKNAD_URL
    }

    spinnsynUrl() {
        return this.env.SPINNSYN_URL
    }

    sykmeldingUrl() {
        return this.env.SYKMELDING_URL
    }

    aktivitetsplanUrl() {
        return this.env.AKTIVITETSPLAN_URL
    }

    oppfolgingsplanUrl() {
        return this.env.OPPFOLGINGSPLAN_URL
    }

    dialogmoteUrl() {
        return this.env.DIALOGMOTE_URL
    }

    dittNavUrl() {
        return this.env.DITTNAV_URL
    }

    sykepengerDokumenterUrl() {
        return this.env.SYKEPENGER_DOKUMENTER_URL
    }

    frontendloggerRoot() {
        return this.env.FRONTENDLOGGER_ROOT
    }

    narmestelederUrl() {
        return this.env.NARMESTELEDER_URL
    }

    arbeidssokerregistreringUrl() {
        return this.env.ARBEIDSSOKERREGISTRERING_URL
    }

    amplitudeKey() {
        return this.env.AMPLITUDE_KEY
    }

    amplitudeEnabled() {
        return this.env.AMPLITUDE_ENABLED === 'true'
    }
}

class MockEnvironment implements EnvironmentInterface {
    isMockBackend() {
        return true
    }

    isQ1() {
        return false
    }

    isOpplaering() {
        return process.env.REACT_APP_OPPLAERING === 'true'
    }

    isProd() {
        return false
    }

    sykmeldingerBackendProxyRoot() {
        return ''
    }

    flexGatewayRoot() {
        return ''
    }

    syfoApiRoot() {
        return ''
    }

    loginServiceUrl() {
        return ''
    }

    loginServiceRedirectUrl() {
        return ''
    }

    sykepengesoknadUrl() {
        return ''
    }

    spinnsynUrl() {
        return ''
    }

    sykmeldingUrl() {
        return ''
    }

    aktivitetsplanUrl() {
        return ''
    }

    oppfolgingsplanUrl() {
        return ''
    }

    dialogmoteUrl() {
        return ''
    }

    dittNavUrl() {
        return ''
    }

    sykepengerDokumenterUrl() {
        return ''
    }

    frontendloggerRoot() {
        return ''
    }

    narmestelederUrl() {
        return ''
    }

    arbeidssokerregistreringUrl() {
        return 'https://arbeidssokerregistrering.nav.no/start?fraSykefravaer=true'
    }

    amplitudeKey() {
        return ''
    }

    amplitudeEnabled() {
        return false
    }
}

function hentEnvironment(): EnvironmentInterface {
    if (process.env.NODE_ENV === 'development') {
        return new MockEnvironment()
    }
    return new Environment()
}

const env = hentEnvironment()

export default env
