import dayjs from 'dayjs'

import { jsonDeepCopy } from '../../../utils/jsonDeepCopy'
import { tekst } from '../../../utils/tekster'
import { brev } from './brev'
import { avbrutt, avventendeUnderArbeid, nyUnderArbeid, utdatert } from './oppfolgingsplaner'
import { Persona } from './persona'
import { soknader } from './soknader'
import { nySykmelding, sendtSykmelding } from './sykmeldinger'
import { vedtakMed100Grad } from './vedtak'

export const commonPersona = (): Persona => {
    return {
        meldinger: [],
        soknader: [],
        oppfolgingsplaner: [],
        vedtak: [],
        sykmeldinger: [],
        narmesteledere: [],
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { erUnderOppfolging: false },
        dialogmoteBehov: {
            visMotebehov: false,
            skjemaType: null,
            motebehov: null,
        },
        brev: [],
    }
}

export const enNySykmelding: Persona = {
    soknader: [],
    meldinger: [],
    vedtak: [],
    oppfolgingsplaner: [],
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykmeldinger: [nySykmelding],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { erUnderOppfolging: false },
    brev: [],
}

export const enAvvistSykmelding: Persona = {
    soknader: [],
    vedtak: [],
    oppfolgingsplaner: [],
    meldinger: [],
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykmeldinger: [
        {
            id: 'AVVIST',
            sykmeldingStatus: { statusEvent: 'APEN' },
            behandlingsutfall: { status: 'INVALID' },
            sykmeldingsperioder: [{ fom: '2021-03-01', tom: '2021-03-12' }],
            syketilfelleStartDato: '2021-03-01',
        },
    ],
    narmesteledere: [],
    snartSluttSykepenger: false,
    arbeidsrettetOppfolging: { erUnderOppfolging: false },
    brev: [],
}

export const kunEnSoknad = () => {
    const person = commonPersona()
    person.soknader = []
    person.sykmeldinger = [jsonDeepCopy(sendtSykmelding)]
    person.sykmeldinger[0].sykmeldingStatus.arbeidsgiver!.orgNavn = 'MATBUTIKKEN AS'
    person.meldinger = [
        {
            uuid: '123456y7',
            tekst: tekst('oppgaver.sykepengesoknad.enkel'),
            lenke: 'https://sykepengesoknad.labs.nais.io/syk/sykepengesoknad/soknader/963e816f-7b3c-4513-818b-95595d84dd91/1?testperson=brukertest',
            variant: 'info',
            meldingType: 'ny søknad',
            lukkbar: false,
        },
    ]
    return person
}

export const defaultPersona: Persona = {
    soknader: soknader,
    meldinger: [],
    vedtak: [vedtakMed100Grad],
    oppfolgingsplaner: [nyUnderArbeid, utdatert, avbrutt, avventendeUnderArbeid],
    dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
    sykmeldinger: [
        sendtSykmelding,
        {
            id: 'APEN',
            sykmeldingStatus: {
                statusEvent: 'BEKREFTET',
                sporsmalOgSvarListe: [
                    {
                        shortName: 'FORSIKRING',
                        svar: { svarType: 'JA_NEI', svar: 'JA' },
                    },
                    {
                        shortName: 'FRAVAER',
                        svar: { svarType: 'JA_NEI', svar: 'NEI' },
                    },
                    {
                        shortName: 'ARBEIDSSITUASJON',
                        svar: {
                            svarType: 'ARBEIDSSITUASJON',
                            svar: 'FRILANSER',
                        },
                    },
                ],
            },
            behandlingsutfall: { status: 'OK' },
            sykmeldingsperioder: [{ fom: '2021-03-15', tom: '2021-03-19' }],
            syketilfelleStartDato: '2021-03-01',
        },
        {
            id: 'AVVIST',
            sykmeldingStatus: { statusEvent: 'APEN' },
            behandlingsutfall: { status: 'INVALID' },
            sykmeldingsperioder: [{ fom: '2021-03-19', tom: '2021-03-19' }],
            syketilfelleStartDato: '2021-03-01',
        },
    ],
    narmesteledere: [
        {
            navn: 'Albus Dumbledore',
            orgnummer: '972674818',
            arbeidsgiverForskutterer: true,
            aktivFom: '2021-03-19',
        },
    ],
    snartSluttSykepenger: true,
    arbeidsrettetOppfolging: { erUnderOppfolging: true },
    brev: brev,
}
