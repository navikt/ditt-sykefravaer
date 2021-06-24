class Environment {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private env = (window as any)._env_;

    get isDev() {
        return this.env.ENVIRONMENT === 'dev'
    }

    get isQ1() {
        return this.env.ENVIRONMENT === 'q1'
    }

    get isProd() {
        return this.env.ENVIRONMENT === 'prod'
    }

    get sykmeldingerBackendProxyRoot() {
        return this.env.SYKMELDINGER_BACKEND_PROXY_ROOT
    }

    get flexGatewayRoot() {
        return this.env.FLEX_GATEWAY_ROOT
    }

    get syfoApiRoot() {
        return this.env.SYFOAPI_ROOT
    }

    get isMockBackend() {
        return this.env.MOCK_BACKEND === 'true'
    }

    get isOpplaering() {
        return this.env.OPPLAERING === 'true'
    }

    get loginServiceUrl() {
        return this.env.LOGINSERVICE_URL
    }

    get loginServiceRedirectUrl() {
        return this.env.LOGINSERVICE_REDIRECT_URL
    }

    get sykepengesoknadUrl() {
        return this.env.SYKEPENGESOKNAD_URL
    }

    get spinnsynUrl() {
        return this.env.SPINNSYN_URL
    }

    get sykmeldingUrl() {
        return this.env.SYKMELDING_URL
    }

    get aktivitetsplanUrl() {
        return this.env.AKTIVITETSPLAN_URL
    }

    get oppfolgingsplanUrl() {
        return this.env.OPPFOLGINGSPLAN_URL
    }

    get dialogmoteUrl() {
        return this.env.DIALOGMOTE_URL
    }

    get dittNavUrl() {
        return this.env.DITTNAV_URL
    }

    get frontendloggerRoot() {
        return this.env.FRONTENDLOGGER_ROOT
    }

    get amplitudeKey() {
        return this.env.AMPLITUDE_KEY
    }

    get amplitudeEnabled() {
        return this.env.AMPLITUDE_ENABLED === 'true'
    }

    get narmestelederUrl() {
        return this.env.NARMESTELEDER_URL
    }

    get arbeidssokerregistreringUrl() {
        return this.env.ARBEIDSSOKERREGISTRERING_URL
    }
}

const env = new Environment()

export default env
