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
} from '../../types/sykmelding/sykmelding'
import { ArbeidssituasjonType } from '../../types/sykmelding/sykmeldingCommon'
import { JaEllerNei } from '../../types/sykmelding/sykmeldingBrukerSvar'
import { dateAdd, dateSub } from '../dateUtils'
import { sporsmal } from '../sporsmal'
import { testDato } from '../../data/mock/mock-db/data-creators'

export function createSykmelding(overrides?: Partial<Sykmelding>, statusEvent = StatusEvent.APEN): Sykmelding {
    const mottatt = overrides?.mottattTidspunkt ?? dateSub(testDato, { days: 2 })

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
        merknader: null,
        meldingTilArbeidsgiver: null,
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
            erIArbeid: null,
            erIkkeIArbeid: null,
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
            mellomnavn: null,
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
            mellomnavn: null,
            etternavn: 'Nordmann',
            overSyttiAar: null,
        },
        utenlandskSykmelding: null,
        rulesetVersion: 2,
        ...overrides,
    }
}

export const createSykmeldingStatus = (
    overrides?: Partial<Sykmelding['sykmeldingStatus']>,
): Sykmelding['sykmeldingStatus'] => ({
    timestamp: '2020-04-01',
    statusEvent: StatusEvent.SENDT,
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
        uriktigeOpplysninger: null,
        arbeidsgiverOrgnummer: null,
        riktigNarmesteLeder: null,
        harBruktEgenmeldingsdager: null,
        egenmeldingsdager: null,
        harBruktEgenmelding: null,
        egenmeldingsperioder: null,
        harForsikring: null,
        fisker: null,
        arbeidsledig: null,
    },
    ...overrides,
})

export const createSykmeldingPeriode = (overrides?: Partial<Periode>): Periode => ({
    type: Periodetype.REISETILSKUDD,
    fom: '2020-04-01',
    tom: '2020-04-15',
    gradert: null,
    behandlingsdager: null,
    innspillTilArbeidsgiver: null,
    aktivitetIkkeMulig: null,
    reisetilskudd: false,
    ...overrides,
})

export function createUnderBehandlingMerknad(): Pick<Sykmelding, 'merknader'> {
    return { merknader: [{ type: Merknadtype.UNDER_BEHANDLING, beskrivelse: null }] }
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
