import { AnnenFraverGrunn } from '../../../types/sykmelding'

export interface Diagnose {
    kode: string
    system: string
    tekst: string | null
}

export interface AnnenFraversArsak {
    beskrivelse: string | null
    grunn: AnnenFraverGrunn[]
}

export interface MedisinskVurdering {
    hovedDiagnose: Diagnose | null
    biDiagnoser: Diagnose[]
    annenFraversArsak: AnnenFraversArsak | null
    svangerskap: boolean
    yrkesskade: boolean
    yrkesskadeDato: string | null
}
