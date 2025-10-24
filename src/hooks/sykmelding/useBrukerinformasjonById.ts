import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { prettifyOrgName } from '../../utils/orgUtils'
import { UseTestpersonQuery } from '../useTestpersonQuery'

export type NaermesteLeder = {
    readonly navn: string
}
export type Arbeidsgiver = {
    readonly aktivtArbeidsforhold: boolean
    readonly naermesteLeder?: NaermesteLeder | null
    navn: string
    readonly orgnummer: string
}
export type Brukerinformasjon = {
    readonly arbeidsgivere: Arbeidsgiver[]
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
