import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { UseTestpersonQuery } from '../useTestpersonQuery'
import { ArbeidssituasjonType } from '../../types/sykmelding/sykmeldingCommon'

export default function useErForsteSykmelding(sykmeldingId: string, arbeidssituasjon: ArbeidssituasjonType) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<ErForsteSykmeldingResponse, Error>({
        queryKey: ['er-forste-sykmelding', sykmeldingId, arbeidssituasjon],
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/er-forste-sykmelding/' +
                    arbeidssituasjon +
                    testpersonQuery.query(),
            ),
    })
}

interface ErForsteSykmeldingResponse {
    erForsteSykmelding: boolean
}
