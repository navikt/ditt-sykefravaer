export interface Sykmelding {
    id: string;
    sykmeldingStatus: {
        statusEvent: 'SENDT' | 'APEN' | 'AVBRUTT' | 'UTGATT' | 'BEKREFTET',
    };
    behandlingsutfall: {
        status: 'OK' | 'MANUAL_PROCESSING' | 'INVALID',
    }
}
