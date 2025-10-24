import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { prettifyOrgName } from '../../utils/orgUtils'
import { UseTestpersonQuery } from '../useTestpersonQuery'
import { TidligereArbeidsgiver } from '../../types/sykmelding/tidligereArbeidsgiver'

export default function useTidligereArbeidsgivereById(sykmeldingId: string) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<TidligereArbeidsgiver[], Error>({
        queryKey: ['tidligere-arbeidsgivere', sykmeldingId],
        queryFn: async () => {
            const tidligereArbeidsgivere: TidligereArbeidsgiver[] = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/tidligere-arbeidsgivere' +
                    testpersonQuery.query(),
            )

            const seen = new Set()
            const dedupliserteArbeidsgivere = tidligereArbeidsgivere
                .map((arbeidsgiver) => ({
                    orgNavn: prettifyOrgName(arbeidsgiver.orgNavn),
                    orgnummer: arbeidsgiver.orgnummer,
                }))
                .filter(({ orgNavn, orgnummer }) => {
                    const key = `${orgNavn}-${orgnummer}`
                    if (seen.has(key)) return false
                    seen.add(key)
                    return true
                })

            return dedupliserteArbeidsgivere
        },
    })
}
