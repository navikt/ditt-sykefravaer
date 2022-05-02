export type MotebehovSkjemaType = 'MELD_BEHOV' | 'SVAR_BEHOV'

export interface Motebehov {
    id: string
}

export interface DialogmoteBehov {
    visMotebehov: boolean
    skjemaType: MotebehovSkjemaType | null
    motebehov: Motebehov | null
}
