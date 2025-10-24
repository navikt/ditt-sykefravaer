import { useQuery } from '@tanstack/react-query'

import { fetchJsonMedRequestId } from '../../utils/fetch'
import { prettifyOrgName } from '../../utils/orgUtils'
import { UseTestpersonQuery } from '../useTestpersonQuery'
import { Brukerinformasjon } from '../../types/sykmelding/brukerinformasjon'

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
