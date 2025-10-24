import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../utils/fetch'
import { prettifyOrgName } from '../utils/orgUtils'
import { Scalars } from '../fetching/graphql.generated'

import { UseTestpersonQuery } from './useTestpersonQuery'

export type NaermesteLeder = {
    readonly __typename: 'NaermesteLeder'
    readonly navn: Scalars['String']['output']
}
export type Arbeidsgiver = {
    readonly aktivtArbeidsforhold: boolean
    readonly naermesteLeder?: NaermesteLeder | null
    navn: string
    readonly orgnummer: Scalars['String']['output']
}
export type Brukerinformasjon = {
    readonly arbeidsgivere: ReadonlyArray<Arbeidsgiver>
}
export type BrukerinformasjonFragment = {
    readonly __typename: 'Brukerinformasjon'
    readonly arbeidsgivere: ReadonlyArray<{
        readonly __typename: 'Arbeidsgiver'
        readonly orgnummer: string
        readonly navn: string
        readonly aktivtArbeidsforhold: boolean
        readonly naermesteLeder?: { readonly __typename: 'NaermesteLeder'; readonly navn: string } | null
    }>
}

export default function useBrukerInformasjonById(sykmeldingId: string) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Brukerinformasjon, Error>({
        queryKey: ['brukerinformasjon', sykmeldingId],
        queryFn: async () => {
            const res: Brukerinformasjon = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/brukerinformasjon' +
                    testpersonQuery.query(),
            )
            res.arbeidsgivere.forEach((arbeidsgiver) => {
                arbeidsgiver.navn = prettifyOrgName(arbeidsgiver.navn)
            })
            return res
        },
    })
}
