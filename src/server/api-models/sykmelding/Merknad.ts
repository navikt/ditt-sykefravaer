import { Merknadtype } from '../../../types/sykmelding'

export interface Merknad {
    type: Merknadtype
    beskrivelse: string | null
}
