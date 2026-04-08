const defaultMockPublicRuntimeConfig = {
    sykepengesoknadUrl: 'http://example.com',
    oppfolgingsplanUrl: 'http://example.com/oppfolgingsplaner/sykmeldt',
    nyOppfolgingsplanEnabled: 'false',
    nyOppfolgingsplanUrl: 'http://example.com/oppfolgingsplan/sykmeldt',
}

export const mockPublicRuntimeConfig = { ...defaultMockPublicRuntimeConfig }

export function resetMockPublicRuntimeConfig(): void {
    Object.assign(mockPublicRuntimeConfig, defaultMockPublicRuntimeConfig)
}
