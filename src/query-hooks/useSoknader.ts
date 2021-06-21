import { useQuery } from 'react-query'

import { RSSoknad } from '../types/rs-types/rs-soknad'
import { Soknad } from '../types/soknad'
import env from '../utils/environment'
import Fetch from '../utils/Fetch'

function useSoknader() {
    return useQuery<Soknad[], Error>('soknader', () =>
        Fetch.authenticatedGet(
            `${env.flexGatewayRoot}/syfosoknad/api/soknader`,
            async(soknader) => {
                const rssok = soknader as any as RSSoknad[]
                return rssok.map((s) => new Soknad(s))
            },
        ),
    )
}

export default useSoknader
