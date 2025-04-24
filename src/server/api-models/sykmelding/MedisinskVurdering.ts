// Anta at du importerer denne enum-en på samme måte som i Zod-filen
import { AnnenFraverGrunn } from '../../../types/sykmelding'

// --------------------------------------------------
// 1) Diagnose
// --------------------------------------------------
export interface Diagnose {
    kode: string
    system: string
    tekst: string | null
}

// --------------------------------------------------
// 2) AnnenFraversArsak
// --------------------------------------------------
export interface AnnenFraversArsak {
    beskrivelse: string | null
    grunn: AnnenFraverGrunn[]
}

// --------------------------------------------------
// 3) MedisinskVurdering
// --------------------------------------------------
export interface MedisinskVurdering {
    hovedDiagnose: Diagnose | null
    biDiagnoser: Diagnose[]
    annenFraversArsak: AnnenFraversArsak | null
    svangerskap: boolean
    yrkesskade: boolean
    yrkesskadeDato: string | null
}
