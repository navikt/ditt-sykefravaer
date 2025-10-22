export interface DittSykefravaerSykmelding {
    id: string
    sykmeldingStatus: {
        statusEvent: 'SENDT' | 'APEN' | 'AVBRUTT' | 'UTGATT' | 'BEKREFTET'
        sporsmalOgSvarListe?: SporsmalOgSvar[]
        arbeidsgiver?: {
            orgnummer: string
            orgNavn: string
        }
    }
    behandlingsutfall: {
        status: 'OK' | 'MANUAL_PROCESSING' | 'INVALID'
    }
    sykmeldingsperioder: Periode[]
    syketilfelleStartDato?: string
}

export interface SporsmalOgSvar {
    svar?: {
        svar: string
        svarType: 'ARBEIDSSITUASJON' | 'PERIODER' | 'JA_NEI'
    }
    shortName?: 'ARBEIDSSITUASJON' | 'NY_NARMESTE_LEDER' | 'FRAVAER' | 'PERIODE' | 'FORSIKRING'
}

export interface Periode {
    fom: string
    tom: string
}
