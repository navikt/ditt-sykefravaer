export interface Godkjenning {
    godkjenningsTidspunkt: string
    godkjent: boolean
    godkjentAv: {
        fnr: string
    }
}

export interface Oppfolgingsplan {
    id: number
    arbeidstaker: {
        sistInnlogget: string | null
        fnr: string
    }
    virksomhet: {
        virksomhetsnummer: string
    }
    status: 'AVBRUTT' | 'UTDATERT' | 'UNDER_ARBEID'
    sistEndretAv: {
        fnr: string
    }
    godkjenninger: Godkjenning[]
}
