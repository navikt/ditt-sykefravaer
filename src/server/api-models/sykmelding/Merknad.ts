import { z } from 'zod'

import { Merknadtype } from '../../../fetching/graphql.generated'

export type Merknad = z.infer<typeof MerknadSchema>
export const MerknadSchema = z.object({
    type: z.nativeEnum(Merknadtype),
    beskrivelse: z.string().nullable(),
})
