import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { proxyKallTilBackend } from '../../../proxy/backendproxy'
import { SendSykmeldingValues } from 'src/server/api-models/SendSykmelding'
import { SykmeldingUserEventV3Api } from 'src/server/api-models/SendSykmelding'
import { Brukerinformasjon } from 'src/server/api-models/Brukerinformasjon'
import { ErUtenforVentetid } from 'src/server/api-models/ErUtenforVentetid'
import { Sykmelding } from 'src/server/api-models/sykmelding/Sykmelding'
import { fetchMedRequestId } from 'src/utils/fetch'
import getHeadersFromRequest from 'src/utils/fetch'


const { serverRuntimeConfig } = getConfig()

const tillatteApier = [
    'GET /api/v1/sykmeldinger',
    'GET /api/v1/sykmeldinger/[uuid]',
    'POST /api/v1/sykmeldinger/[uuid]/send',
    'POST /api/v1/sykmeldinger/[uuid]/changestatus',
    'GET /api/v1/sykmeldinger/[uuid]/er-utenfor-ventetid',
    'GET /api/v1/sykmeldinger/[uuid]/brukerinformasjon',
    'GET /api/v1/sykmeldinger/[uuid]/tidligere-arbeidsgivere',
    // Add your intercepted endpoint here if needed
]

/*

import { SendSykmeldingValues } from '../fetching/graphql.generated'
import { SykmeldingUserEventV3Api } from './api-models/SendSykmelding'
import { Brukerinformasjon } from './api-models/Brukerinformasjon'
import { ErUtenforVentetid } from './api-models/ErUtenforVentetid'
import { Sykmelding } from './api-models/sykmelding/Sykmelding'

export function mapSendSykmeldingValuesToV3Api(
    values: SendSykmeldingValues,
    sykmelding: Sykmelding,
    brukerinformasjon: Brukerinformasjon,
    erUtenforVentetid: ErUtenforVentetid,
)

*/

function forwardRequestHeaders(req: NextApiRequest): HeadersInit {
    const headers: Record<string, string> = {}

    for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string') {
            headers[key] = value
        } else if (Array.isArray(value)) {
            headers[key] = value.join(',')
        }
    }

    return headers
}


export async function getSykmeldinger(req: NextApiRequest): Promise<Sykmelding[]> {
    const res = await fetchMedRequestId(
        '/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/sykmeldinger',
        {
            method: 'GET',
            credentials: 'include',
            headers: forwardRequestHeaders(req),

        },
    )
    return res.response.json()
}

export async function getSykmelding(sykmeldingId: string, req: NextApiRequest): Promise<Sykmelding> {
    const res = await fetchMedRequestId(
        `/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/sykmeldinger/${sykmeldingId}`,
        {
            method: 'GET',
            credentials: 'include',
            headers: forwardRequestHeaders(req),

        },
    )
    return res.response.json()
}

export async function getBrukerinformasjonById(
    sykmeldingId: string,
    req: NextApiRequest,
): Promise<Brukerinformasjon> {
    const res = await fetchMedRequestId(
        `/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/sykmeldinger/${sykmeldingId}/brukerinformasjon`,
        {
            method: 'GET',
            credentials: 'include',
            headers: forwardRequestHeaders(req),

        },
    )
    return res.response.json()
}

export async function getBrukerinformasjon(req: NextApiRequest): Promise<Brukerinformasjon> {
    const res = await fetchMedRequestId(
        '/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/sykmeldinger/brukerinformasjon',
        {
            method: 'GET',
            credentials: 'include',
            headers: forwardRequestHeaders(req),

        },
    )
    return res.response.json()
}


const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method ?? ''
    const url = req.url ?? ''

    if (
        url.includes('/api/v1/sykmeldinger/') && 
        url.includes('/send') &&
        /^\/api\/v1\/sykmeldinger\/[^/]+\/send$/.test(url)
    ) {
        // Get UUID from req.query.path array
        // In a catch-all route like [[...path]], the dynamic segments are in the path array
        const pathSegments = req.query.path as string[]
        const uuid = pathSegments?.[2] // Index 2 would be the UUID in /api/v1/sykmeldinger/[uuid]/send
        
        if (uuid) {
            console.log('Intercepted sykmelding with UUID:', uuid)
            // return 200
            res.status(200).json({ message: 'Sykmelding intercepted successfully', uuid })
            // Use the uuid
            //  here
            
            
        }
    }
    



    await proxyKallTilBackend({
        req,
        res,
        tillatteApier,
        backend: 'flex-sykmeldinger-backend',
        hostname: 'flex-sykmeldinger-backend',
        backendClientId: serverRuntimeConfig.flexSykmeldingerBackendClientId,
        https: false,
    })
})

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
}

export default handler
