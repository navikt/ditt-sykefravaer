export interface Godkjenning {
    godkjenningsTidspunkt: string
    godkjent: boolean,
    godkjentAv: {
        fnr: string
    }
}

export interface Oppfolgingsplan {
    id: string,
    arbeidstaker: {
        sistInnlogget: string | null
        fnr: string
    }
    virksomhet: {
        virksomhetsnummer: string
    }
    status: string
    sistEndretAv: {
        fnr: string
    }
    godkjenninger: Godkjenning[]
}
