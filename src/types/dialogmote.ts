export type DialogmoteStatus = 'AVBRUTT' | 'MØTESTATUS' | 'BEKREFTET' | 'SKJEMA'

export interface TidOgSted {
    id: number
    tid: string
    created: string
    sted: string
    valgt: boolean
}

export interface MoteDeltakere {
    navn: string
    fnr: string
    orgnummer: string
    epost: string
    type: 'Bruker' | 'Arbeidstaker' | 'Arbeidsgiver'
    svartidspunkt: string
    svar: TidOgSted[]
}

export interface DialogMote {
    bekreftetAlternativ: TidOgSted
    alternativer: TidOgSted[]
    opprettetTidspunkt: string
    bekreftetTidspunkt: string
    deltakere: MoteDeltakere[]
    status: DialogmoteStatus
}
