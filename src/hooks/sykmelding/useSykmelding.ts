import { useQuery, UseQueryResult } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { prettifyOrgName } from '../../utils/orgUtils'
import { Sykmelding } from '../../types/sykmelding/sykmelding'
import { UseTestpersonQuery } from '../useTestpersonQuery'

export default function useSykmelding(sykmeldingId: string): UseQueryResult<Sykmelding, Error> {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<Sykmelding, Error>({
        queryKey: ['sykmeldinger-flex', sykmeldingId],
        queryFn: async () => {
            const sykmelding: Sykmelding = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    testpersonQuery.query(),
            )
            // Midlertidig hack til typing er på plass og riktig discriminator er innført
            // if (sykmelding.sykmeldingStatus.brukerSvar) {
            //     sykmelding.sykmeldingStatus.brukerSvar.__typename = 'BrukerSvar'
            // }
            if (sykmelding.sykmeldingStatus.arbeidsgiver?.orgNavn) {
                // @ts-expect-error Midlertidig hack til typing er på plass og riktig discriminator er innført
                sykmelding.sykmeldingStatus.arbeidsgiver.orgNavn = prettifyOrgName(
                    sykmelding.sykmeldingStatus.arbeidsgiver?.orgNavn,
                )
            }
            return sykmelding
        },
    })
}
