import {
    AnnenFraverGrunn,
    ArbeidsrelatertArsakType,
    MedisinskArsakType,
    Merknadtype,
    Periode,
    Periodetype,
    RegelStatus,
    StatusEvent,
    Sykmelding,
    SykmeldingStatus,
} from '../../types/sykmelding'
import { ArbeidssituasjonType } from '../../types/sykmeldingCommon'
import { JaEllerNei } from '../../types/sykmeldingBrukerSvar'

import { dateAdd, dateSub } from '../dateUtils'
import { sporsmal } from '../sporsmal'
import { ShortName, Svartype } from '../../types/sykmeldingSporsmalSvarListe'

export function createSykmelding(overrides?: Partial<Sykmelding>, statusEvent = StatusEvent.APEN): Sykmelding {
    const mottatt = overrides?.mottattTidspunkt ?? dateSub(new Date(), { days: 2 })

    return {
        id: 'test-sykmelding',
        mottattTidspunkt: mottatt,
        sykmeldingStatus: createSykmeldingStatus({
            timestamp: mottatt,
            statusEvent,
        }),
        behandlingsutfall: {
            status: RegelStatus.OK,
            ruleHits: [],
        },
        arbeidsgiver: {
            navn: 'Arbeidsgiver AS',
        },
        merknader: undefined,
        meldingTilArbeidsgiver: undefined,
        sykmeldingsperioder: [
            createSykmeldingPeriode({
                fom: mottatt,
                tom: dateAdd(mottatt, { days: 5 }),
                behandlingsdager: 2,
                type: Periodetype.BEHANDLINGSDAGER,
            }),
            createSykmeldingPeriode({
                fom: mottatt,
                tom: dateAdd(mottatt, { days: 5 }),
                type: Periodetype.AKTIVITET_IKKE_MULIG,
                aktivitetIkkeMulig: {
                    medisinskArsak: {
                        arsak: [MedisinskArsakType.ANNET, MedisinskArsakType.AKTIVITET_FORVERRER_TILSTAND],
                        beskrivelse: 'Dette er en beskrivelse av den medisinske årsaken.',
                    },
                    arbeidsrelatertArsak: {
                        arsak: [ArbeidsrelatertArsakType.ANNET],
                        beskrivelse: 'Dette er en beskrivelse av den arbeidsrelaterte årsaken',
                    },
                },
            }),
            createSykmeldingPeriode({
                fom: dateAdd(mottatt, { days: 6 }),
                tom: dateAdd(mottatt, { days: 11 }),
                type: Periodetype.GRADERT,
                gradert: {
                    grad: 20,
                    reisetilskudd: false,
                },
            }),
        ],
        medisinskVurdering: {
            hovedDiagnose: {
                system: '2.16.578.1.12.4.1.1.7170',
                kode: 'K24',
                tekst: 'Rar sykdom',
            },
            biDiagnoser: [
                {
                    system: '2.16.578.1.12.4.1.1.7170',
                    kode: '-57',
                    tekst: 'Rar sykdom',
                },
                {
                    system: '2.16.578.1.12.4.1.1.7170',
                    kode: '-59',
                    tekst: 'Sykdom0',
                },
            ],
            svangerskap: true,
            yrkesskade: true,
            yrkesskadeDato: '2018-10-18',
            annenFraversArsak: {
                beskrivelse:
                    'word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word word',
                grunn: [AnnenFraverGrunn.NODVENDIG_KONTROLLUNDENRSOKELSE],
            },
        },
        prognose: {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'Du må ta det rolig på jobben',
            erIArbeid: undefined,
            erIkkeIArbeid: undefined,
        },
        utdypendeOpplysninger: {
            '6.1': {
                '6.1.1': {
                    sporsmal: 'Dette er et spørsmål 1',
                    svar: 'Dette er et svar',
                    restriksjoner: [],
                },
            },
            '6.2': {
                '6.2.1': {
                    sporsmal: 'Dette er et spørsmål 2',
                    svar: 'Dette er et svar',
                    restriksjoner: [],
                },
                '6.2.2': {
                    sporsmal: 'Dette er et spørsmål 3',
                    svar: 'Dette er et svar',
                    restriksjoner: [],
                },
            },
        },
        tiltakArbeidsplassen: 'Tiltak på arbeidsplassen',
        tiltakNAV: 'Tiltak NAV',
        andreTiltak: 'Du må gjøre andre tiltak',
        meldingTilNAV: {
            bistandUmiddelbart: true,
            beskrivBistand: 'Trenger hjelp med penger',
        },
        kontaktMedPasient: {
            kontaktDato: '2020-04-01',
            begrunnelseIkkeKontakt: 'Han var kjempesyk',
        },
        behandletTidspunkt: dateAdd(mottatt, { days: 10 }),
        behandler: {
            fornavn: 'Fornavn',
            mellomnavn: undefined,
            etternavn: 'Etternavn',
            adresse: {
                gate: 'Gateveien 4',
                postnummer: 1001,
                kommune: 'Oslo',
                postboks: '1212 Gateveien',
                land: 'NO',
            },
            tlf: '900 00 000',
        },
        egenmeldt: false,
        papirsykmelding: false,
        pasient: {
            fnr: '12345678901',
            fornavn: 'Ola',
            mellomnavn: undefined,
            etternavn: 'Nordmann',
            overSyttiAar: undefined,
        },
        utenlandskSykmelding: undefined,
        rulesetVersion: 2,
        ...overrides,
    }
}

export const createSykmeldingStatus = (
    overrides?: Partial<Sykmelding['sykmeldingStatus']>,
): Sykmelding['sykmeldingStatus'] => ({
    timestamp: '2020-04-01',
    statusEvent: StatusEvent.SENDT,
    sporsmalOgSvarListe: [],
    arbeidsgiver: {
        orgnummer: 'default-arbeidsgiver',
        orgNavn: 'Default Arbeidsgiverssen AS',
    },
    brukerSvar: {
        arbeidssituasjon: {
            sporsmaltekst: sporsmal.arbeidssituasjon,
            svar: ArbeidssituasjonType.ARBEIDSTAKER,
        },
        erOpplysningeneRiktige: {
            sporsmaltekst: sporsmal.erOpplysningeneRiktige,
            svar: JaEllerNei.JA,
        },
        uriktigeOpplysninger: undefined,
        arbeidsgiverOrgnummer: undefined,
        riktigNarmesteLeder: undefined,
        harBruktEgenmeldingsdager: undefined,
        egenmeldingsdager: undefined,
        harBruktEgenmelding: undefined,
        egenmeldingsperioder: undefined,
        harForsikring: undefined,
        fisker: undefined,
        arbeidsledig: undefined,
    },
    ...overrides,
})

export const createSykmeldingPeriode = (overrides?: Partial<Periode>): Periode => ({
    type: Periodetype.REISETILSKUDD,
    fom: '2020-04-01',
    tom: '2020-04-15',
    gradert: undefined,
    behandlingsdager: undefined,
    innspillTilArbeidsgiver: undefined,
    aktivitetIkkeMulig: undefined,
    reisetilskudd: false,
    ...overrides,
})

export function createUnderBehandlingMerknad(): Pick<Sykmelding, 'merknader'> {
    return { merknader: [{ type: Merknadtype.UNDER_BEHANDLING, beskrivelse: undefined }] }
}

export function createAvvistBehandlingsutfall(
    reason = 'Sykmeldingen er tilbakedatert uten tilstrekkelig begrunnelse fra den som sykmeldte deg.',
): Pick<Sykmelding, 'behandlingsutfall'> {
    return {
        behandlingsutfall: {
            status: RegelStatus.INVALID,
            ruleHits: [
                {
                    messageForSender: reason,
                    messageForUser: reason,
                    ruleName: 'INNTIL_8_DAGER',
                    ruleStatus: RegelStatus.INVALID,
                },
            ],
        },
    }
}

export function createInitialQuery<Query, Variables>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typedDocumentNode: any,
    data: Query,
    variables?: Variables,
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any {
    return {
        query: typedDocumentNode,
        data,
        variables,
    }
}

export function createMock(mockedResponse: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any
    error?: Error
    delay?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newData?: any
}): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any {
    return mockedResponse
}

export function createEgenmeldingsdagerSporsmal(dates: string[]): SykmeldingStatus['sporsmalOgSvarListe'][0] {
    return {
        tekst: '',
        shortName: ShortName.EGENMELDINGSDAGER,
        svar: {
            svarType: Svartype.DAGER,
            svar: dates,
        },
    }
}
