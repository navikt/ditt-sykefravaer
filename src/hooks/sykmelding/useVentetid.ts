import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { UseTestpersonQuery } from '../useTestpersonQuery'
import { ArbeidssituasjonType } from '../../types/sykmelding/sykmeldingCommon'

export default function useVentetid(
    sykmeldingId: string,
    arbeidssituasjon: ArbeidssituasjonType | undefined,
    enabled = true,
) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<VentetidResponse, Error>({
        queryKey: ['ventetid', sykmeldingId, arbeidssituasjon],
        enabled: enabled && arbeidssituasjon !== undefined,
        queryFn: () =>
            fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    '/ventetid/' +
                    arbeidssituasjon +
                    testpersonQuery.query(),
            ),
    })
}

export interface VentetidResponse {
    erUtenforVentetid: boolean
    erForsteSykmelding: boolean
    tidligsteFom?: string | null
}
