import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

import { beskyttetApi } from '../../../auth/beskyttetApi'
import { Personalia } from '../../../types/types'
import { isProd } from '../../../utils/environment'

type QueryString = { [ key: string ]: string | string[] }

const isNumber = (char: string) => !isNaN(parseInt(char, 10))

const hentMockKontonummer = (id: string): string | null => {
    // Randomisering for testing. Returnerer et kontonummer kun om første tegn i id er et tall
    if (!isNumber(id)) {
        return null
    }
    return '10011110011'
}

const hentProdKontonummer = async(selvbetjeningsToken: string) => {
    // Hardkoder URL da dette er data som kun finnes i produksjon.
    const res = await fetch('https://www.nav.no/person/personopplysninger-api/personalia', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `selvbetjening-idtoken=${selvbetjeningsToken}`,
        }
    })
    const data: Personalia = await res.json()
    return data?.personalia?.kontonr
}

function finnSelvbetjeningsToken(cookies: string | undefined) {
    const parsedCookies = cookie.parse(cookies || '')
    return parsedCookies[ 'selvbetjening-idtoken' ]
}

function finnVedtaksId(queryString: QueryString) {
    // Kun brukt til mockData, så vi kan leve med at dette kan være et array.
    return queryString.id[ 0 ]
}

async function hentKontonummer(queryString: QueryString, cookies: string | undefined) {
    if (isProd()) {
        return hentProdKontonummer(finnSelvbetjeningsToken(cookies))
    } else {
        return hentMockKontonummer(finnVedtaksId(queryString)!)
    }
}

// Ett mock-kontonummer blir returnert for dev, så dev må være ubeskyttet i tillegg til prod.
const handler = beskyttetApi(async(req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).json('Kun GET er tillatt')
    }
    const kontonummer = await hentKontonummer(req.query, req.headers.cookie)
    if (kontonummer) {
        return res.status(200).json({ kontonummer: kontonummer })
    }

    return res.status(404).json(null)
})

export default handler
