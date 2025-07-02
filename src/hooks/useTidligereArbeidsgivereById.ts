import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../utils/fetch'
import { prettifyOrgName } from '../utils/orgUtils'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function useTidligereArbeidsgivereById(sykmeldingId: string) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<TidligereArbeidsgivereArray, Error>({
        queryKey: ['tidligere-arbeidsgivere', sykmeldingId],
        queryFn: async () => {
            const tidligereArbeidsgivere: TidligereArbeidsgivereArray = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/tidligere-arbeidsgivere' +
                    testpersonQuery.query(),
            )
            
            console.log(`Tidligere arbeidsgivere for sykmeldingId ${sykmeldingId} hentet:`, tidligereArbeidsgivere)
            return tidligereArbeidsgivere.map((arbeidsgiver) => ({
                orgNavn: prettifyOrgName(arbeidsgiver.orgNavn),
                orgnummer: arbeidsgiver.orgnummer,
            }))


        },
    })
}

export type TidligereArbeidsgiver = {
    readonly orgNavn: string
    readonly orgnummer: string
}
export type TidligereArbeidsgivereArray = ReadonlyArray<TidligereArbeidsgiver>
