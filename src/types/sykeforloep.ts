export interface Sykeforloep {
    oppfolgingsdato: string
    sykmeldinger: SimpleSykmelding[]
}

export interface SimpleSykmelding {
    fom: string
    tom: string
}
