import { Merknadtype } from '../../../fetching/graphql.generated'

export interface Merknad {
    type: Merknadtype
    beskrivelse: string | null
}
