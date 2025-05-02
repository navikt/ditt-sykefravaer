export function getBehandlerName<Behandler extends { fornavn: string; mellomnavn?: string | null; etternavn: string }>(
    behandler?: Behandler | null,
): string {
    if (!behandler) {
        return 'Ukjent behandler'
    }
    return `${behandler.fornavn}${behandler.mellomnavn ? ' ' + behandler.mellomnavn : ''} ${behandler.etternavn}`
}
