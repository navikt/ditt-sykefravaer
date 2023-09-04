import { Persona } from '../../testperson'
import { avventendeUnderArbeid, nyUnderArbeid } from '../oppfolgingsplaner'
import { sendtSykmelding } from '../sykmeldinger'

import { commonPersona } from './personas'

export const enNyOppfolgingsplan: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    oppfolgingsplaner: [nyUnderArbeid],
    beskrivelse: 'En ny oppfolgingsplan med status under arbeid',
}

export const toNyeOppfolgingsplaner: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    oppfolgingsplaner: [
        nyUnderArbeid,
        {
            ...nyUnderArbeid,
            id: nyUnderArbeid.id + 1,
        },
    ],
    beskrivelse: 'To nye oppfolgingsplaner med status under arbeid',
}

export const enNyTilGodkjenning: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    oppfolgingsplaner: [avventendeUnderArbeid],
    beskrivelse: 'En ny oppfolgingsplan til godkjenning',
}

export const toTilGodkjenning: Persona = {
    ...commonPersona(),
    sykmeldinger: [sendtSykmelding],
    oppfolgingsplaner: [
        avventendeUnderArbeid,
        {
            ...avventendeUnderArbeid,
            id: avventendeUnderArbeid.id + 1,
        },
    ],
    beskrivelse: 'To nye oppfolgingsplaner til godkjenning',
}
