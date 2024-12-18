import { useQuery } from '@tanstack/react-query'

import { SykmeldingFragment } from 'queries'

import { fetchJsonMedRequestId } from '../utils/fetch'
import { prettifyOrgName } from '../utils/orgUtils'

import { UseTestpersonQuery } from './useTestpersonQuery'

export default function useSykmeldingByIdRest(sykmeldingId: string) {
    const testpersonQuery = UseTestpersonQuery()

    return useQuery<SykmeldingFragment, Error>({
        queryKey: ['sykmeldinger-flex', sykmeldingId],
        queryFn: async () => {
            const sykmelding: SykmeldingFragment = await fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' +
                    sykmeldingId +
                    testpersonQuery.query(),
            )
            // Midlertidig hack til typing er på plass og riktig discriminator er innført
            if (sykmelding.sykmeldingStatus.brukerSvar) {
                sykmelding.sykmeldingStatus.brukerSvar.__typename = 'BrukerSvar'
            }
            if (sykmelding.sykmeldingStatus.arbeidsgiver?.orgNavn) {
                sykmelding.sykmeldingStatus.arbeidsgiver.orgNavn = prettifyOrgName(
                    sykmelding.sykmeldingStatus.arbeidsgiver?.orgNavn,
                )
            }
            return sykmelding
        },
    })
}
