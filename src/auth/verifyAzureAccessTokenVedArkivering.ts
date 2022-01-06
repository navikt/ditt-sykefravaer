import { createRemoteJWKSet, FlattenedJWSInput, JWSHeaderParameters, jwtVerify } from 'jose'
import { GetKeyFunction } from 'jose/dist/types/types'
import getConfig from 'next/config'
import { Client, Issuer } from 'openid-client'

import { ErrorMedStatus } from '../server-utils/ErrorMedStatus'

const { serverRuntimeConfig } = getConfig()

let _issuer: Issuer<Client>
let _remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>


async function validerToken(token: string | Uint8Array) {
    return jwtVerify(token, await jwks(), {
        issuer: (await issuer()).metadata.issuer,
    })
}

async function jwks() {
    if (typeof _remoteJWKSet === 'undefined') {
        const iss = await issuer()
        _remoteJWKSet = createRemoteJWKSet(new URL(<string>iss.metadata.jwks_uri))
    }

    return _remoteJWKSet
}

async function issuer() {
    if (typeof _issuer === 'undefined') {
        if (!serverRuntimeConfig.azureAppWellKnownUrl)
            throw new Error('Miljøvariabelen AZURE_APP_WELL_KNOWN_URL må være satt')
        _issuer = await Issuer.discover(serverRuntimeConfig.azureAppWellKnownUrl)
    }
    return _issuer
}

interface PreauthorizedApps {
    name: string,
    clientId: string
}


export async function verifyAzureAccessTokenVedArkivering(token: string) {

    const verified = await validerToken(token)

    if (verified.payload.aud !== serverRuntimeConfig.azureAppClientId) {
        throw new ErrorMedStatus('Audience matcher ikke min client ID', 401)
    }
    const preAuthorizedApps = JSON.parse(serverRuntimeConfig.azureAppPreAuthorizedApps) as PreauthorizedApps[]

    const spinnsynArkiveringClientId = preAuthorizedApps.find(a => a.name.endsWith('-gcp:flex:spinnsyn-arkivering'))
    if (!spinnsynArkiveringClientId) {
        throw new ErrorMedStatus('Fant ikke spinnsyn arkivering client id', 500)
    }

    const azp = verified.payload.azp
    if (!azp) {
        throw new ErrorMedStatus('Fant ikke azp claim i token', 401)
    }

    if (azp != spinnsynArkiveringClientId.clientId) {
        throw new ErrorMedStatus('AZP claim matcher ikke spinnsyn arkivering', 401)
    }
}


export async function verifyAzureAccessTokenSpinnsynInterne(bearerToken: string) {
    const token = bearerToken.split(' ')[ 1 ]
    const verified = await validerToken(token)

    if (verified.payload.aud !== serverRuntimeConfig.azureAppClientId) {
        throw new ErrorMedStatus('Audience matcher ikke min client ID', 401)
    }
}
