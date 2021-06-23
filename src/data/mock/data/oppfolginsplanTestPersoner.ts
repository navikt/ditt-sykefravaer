import dayjs from 'dayjs'

import { jsonDeepCopy } from '../../../utils/jsonDeepCopy'
import { Persona } from './persona'

const commonPersona: Persona = {
    soknader: [],
    oppfolgingsplaner: [],
    vedtak: [],
    sykmeldinger: [ {
        id: 'SENDT',
        sykmeldingStatus: {
            arbeidsgiver: {
                orgnummer: '972674818',
                orgNavn: 'navnet'
            },
            'statusEvent': 'BEKREFTET',
            'sporsmalOgSvarListe': []
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [ {
            fom: dayjs().subtract(4, 'months').format('YYYY-MM-DD'),
            tom: dayjs().subtract(3, 'months').format('YYYY-MM-DD')
        } ],
    } ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { underOppfolging: false },
}

export const enNyTilGodkjenning = () => {
    const ret = jsonDeepCopy(commonPersona)
    ret.oppfolgingsplaner = [ {
        'id': 4183,
        'status': 'UNDER_ARBEID',
        'virksomhet': { 'virksomhetsnummer': '972674818' },
        'godkjenninger': [],
        'arbeidstaker': {
            'fnr': '18048600146',
            'sistInnlogget': null,

        },
        'sistEndretAv': {
            'fnr': '13098023954',
        }
    } ]
    return ret
}

