export interface InntektsmeldingTyper {
    organisasjonsnavn: string
    inntektsmeldingId: string
    beregnetInntekt?: string
    foersteFravaersdag: string
    mottattDato: string
    arbeidsgiverperioder: Periode[]
    opphoerAvNaturalytelser: OpphoerAvNaturalytelser[]
    endringIRefusjoner: EndringIRefusjon[]
    refusjon: Refusjon
}

export interface EndringIRefusjon {
    beloep: string
    endringsdato: string
}

export interface Refusjon {
    opphoersdato?: string
    beloepPrMnd?: string
}

export interface Periode {
    fom: string
    tom: string
}

export interface OpphoerAvNaturalytelser {
    fom: string
    naturalytelse: string
    beloepPrMnd: string
}

interface Naturalytelser {
    [key: string]: string
}

export const naturalytelser: Naturalytelser = {
    ELEKTRONISKKOMMUNIKASJON: 'Elektronisk kommunikasjon',
    AKSJERGRUNNFONDSBEVISTILUNDERKURS: 'Aksjer / grunnfondsbevis til underkurs',
    LOSJI: 'Losji',
    KOSTDOEGN: 'Kost (døgn)',
    BESOEKSREISERHJEMMETANNET: 'Besøksreiser i hjemmet annet',
    KOSTBESPARELSEIHJEMMET: 'Kostbesparelse i hjemmet',
    RENTEFORDELLAAN: 'Rentefordel lån',
    BIL: 'Bil',
    KOSTDAGER: 'Kost (dager)',
    BOLIG: 'Bolig',
    SKATTEPLIKTIGDELFORSIKRINGER: 'Skattepliktig del av visse forsikringer',
    FRITRANSPORT: 'Fri transport',
    OPSJONER: 'Opsjoner',
    TILSKUDDBARNEHAGEPLASS: 'Tilskudd barnehageplass',
    BEDRIFTSBARNEHAGEPLASS: 'Bedriftsbarnehageplass',
    YRKEBILTJENESTLIGBEHOVKILOMETER: 'Yrkesbil tjenestebehov kilometer',
    YRKEBILTJENESTLIGBEHOVLISTEPRIS: 'Yrkesbil tjenestebehov listepris',
    INNBETALINGTILUTENLANDSKPENSJONSORDNING: 'Innbetaling utenlandsk pensjonsordning',
    ANNET: 'Annet',
}
