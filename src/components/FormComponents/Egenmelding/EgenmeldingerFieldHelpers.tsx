import { YesOrNo } from 'src/fetching/graphql.generated'

export type EgenmeldingsdagerFormValue = {
    harPerioder: YesOrNo | null
    datoer: Date[] | null
    hasClickedVidere: boolean | null
}

export const MAX_EGENMELDINGSDAGER = 16
