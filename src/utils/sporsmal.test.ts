import { describe, it, expect } from 'vitest'

import { ArbeidssituasjonType, Blad, LottOgHyre } from '../types/sykmelding/sykmeldingCommon'
import { UriktigeOpplysningerType } from '../types/sykmelding/sykmeldingBrukerSvar'

import {
    sporsmal,
    arbeidsSituasjonEnumToText,
    arbeidssituasjonLabel,
    arbeidssituasjonDescription,
    uriktigeOpplysningerEnumToText,
    bladbeskrivelse,
    bladTittel,
    lottHyreBeskrivelse,
    lottOgHyreTittel,
} from './sporsmal'

describe('sporsmal', () => {
    describe('sporsmal.riktigNarmesteLeder', () => {
        it('skal inkludere navnet til nærmeste leder i spørsmålet', () => {
            expect(sporsmal.riktigNarmesteLeder('Kari Nordmann')).toBe(
                'Er det Kari Nordmann som skal følge deg opp på jobben mens du er syk?',
            )
        })
    })

    describe('sporsmal.sykFoerSykmeldingen', () => {
        it('skal bruke createDate-funksjonen til å formatere datoen i spørsmålet', () => {
            expect(sporsmal.sykFoerSykmeldingen('2023-01-01', () => '1. januar 2023')).toBe(
                'Var du syk og borte fra jobb før du ble sykmeldt 1. januar 2023?',
            )
        })
    })

    describe('sporsmal.harBruktEgenmelding', () => {
        it('skal returnere riktig spørsmålstekst', () => {
            expect(sporsmal.harBruktEgenmelding()).toBe(
                'Ga du beskjed til Nav om at du var syk, før du fikk sykmelding?',
            )
        })
    })

    describe('sporsmal.egenmeldingsperioder', () => {
        it('skal returnere riktig spørsmålstekst', () => {
            expect(sporsmal.egenmeldingsperioder()).toBe('Når ga du beskjed?')
        })
    })

    describe('sporsmal.harBruktEgenmeldingsdager', () => {
        it('skal inkludere prettifisert arbeidsgivernavn i spørsmålet', () => {
            expect(sporsmal.harBruktEgenmeldingsdager('nav as')).toBe('Brukte du egenmelding hos NAV AS')
        })
    })

    describe('sporsmal.arbeidsledigFra', () => {
        it('skal bruke ARBEIDSLEDIG som standardverdi når ingenting er oppgitt', () => {
            expect(sporsmal.arbeidsledigFra()).toBe('Hvilken arbeidsgiver har du blitt arbeidsledig fra?')
        })

        it('skal bruke oppgitt arbeidssituasjon i spørsmålet', () => {
            expect(sporsmal.arbeidsledigFra(ArbeidssituasjonType.PERMITTERT)).toBe(
                'Hvilken arbeidsgiver har du blitt permittert fra?',
            )
        })
    })

    describe('arbeidsSituasjonEnumToText', () => {
        it('skal oversette hver ArbeidssituasjonType til riktig tekst', () => {
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.ARBEIDSTAKER)).toBe('ansatt')
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.FRILANSER)).toBe('frilanser')
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.NAERINGSDRIVENDE)).toBe(
                'selvstendig næringsdrivende',
            )
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.FISKER)).toBe('fisker')
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.JORDBRUKER)).toBe('jordbruker')
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.ARBEIDSLEDIG)).toBe('arbeidsledig')
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.PERMITTERT)).toBe('permittert')
            expect(arbeidsSituasjonEnumToText(ArbeidssituasjonType.ANNET)).toBe('annet')
        })
    })

    describe('arbeidssituasjonLabel', () => {
        it('skal returnere riktig label for hver ArbeidssituasjonType', () => {
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.ARBEIDSTAKER)).toBe('Ansatt')
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.FRILANSER)).toBe('Frilanser')
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.NAERINGSDRIVENDE)).toBe('Selvstendig næringsdrivende')
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.FISKER)).toBe('Fisker')
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.JORDBRUKER)).toBe('Jordbruker')
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.ARBEIDSLEDIG)).toBe('Arbeidsledig')
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.PERMITTERT)).toBe('Permittert')
            expect(arbeidssituasjonLabel(ArbeidssituasjonType.ANNET)).toBe('Annet')
        })
    })

    describe('arbeidssituasjonDescription', () => {
        it('skal returnere riktig beskrivelse for arbeidssituasjoner som har det', () => {
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.ARBEIDSTAKER)).toBe(
                'Fulltid, deltid, vikar, lærling, tilkallingsvikar',
            )
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.FRILANSER)).toBe('Oppdrag uten registrert foretak')
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.NAERINGSDRIVENDE)).toBe(
                'Enkeltpersonforetak (ENK), ansvarlig selskap (ANS), selskap med delt ansvar (DA)',
            )
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.FISKER)).toBe(
                'Du har hyre, lott eller begge deler, Blad A eller B',
            )
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.JORDBRUKER)).toBe(
                'Du driver med gårdsbruk, skogbruk eller reindrift',
            )
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.ARBEIDSLEDIG)).toBe(
                'Du er uten jobb nå - med eller uten dagpenger fra Nav',
            )
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.PERMITTERT)).toBe(
                'Du er midlertidig ute av arbeid, men har fortsatt en arbeidsgiver',
            )
        })

        it('skal returnere undefined for ANNET', () => {
            expect(arbeidssituasjonDescription(ArbeidssituasjonType.ANNET)).toBeUndefined()
        })
    })

    describe('uriktigeOpplysningerEnumToText', () => {
        it('skal oversette hver UriktigeOpplysningerType til riktig tekst', () => {
            expect(uriktigeOpplysningerEnumToText(UriktigeOpplysningerType.PERIODE)).toBe('Periode')
            expect(uriktigeOpplysningerEnumToText(UriktigeOpplysningerType.SYKMELDINGSGRAD_FOR_LAV)).toBe(
                'Sykmeldingsgraden er for lav',
            )
            expect(uriktigeOpplysningerEnumToText(UriktigeOpplysningerType.SYKMELDINGSGRAD_FOR_HOY)).toBe(
                'Sykmeldingsgraden er for høy',
            )
            expect(uriktigeOpplysningerEnumToText(UriktigeOpplysningerType.ARBEIDSGIVER)).toBe('Arbeidsgiver')
            expect(uriktigeOpplysningerEnumToText(UriktigeOpplysningerType.DIAGNOSE)).toBe('Diagnose')
            expect(uriktigeOpplysningerEnumToText(UriktigeOpplysningerType.ANDRE_OPPLYSNINGER)).toBe(
                'Andre opplysninger',
            )
        })
    })

    describe('bladbeskrivelse', () => {
        it('skal beskrive Blad A som binæring', () => {
            expect(bladbeskrivelse(Blad.A)).toBe('Du har fiske som binæring og har som regel en annen jobb i tillegg')
        })

        it('skal beskrive Blad B som hovednæring', () => {
            expect(bladbeskrivelse(Blad.B)).toBe('Du har fiske som hovednæring')
        })

        it('skal returnere tom streng for Blad.Ingen', () => {
            expect(bladbeskrivelse(Blad.Ingen)).toBe('')
        })
    })

    describe('bladTittel', () => {
        it('skal returnere riktig tittel for Blad A', () => {
            expect(bladTittel(Blad.A)).toBe('Nei, jeg er registrert på Blad A')
        })

        it('skal returnere riktig tittel for Blad B', () => {
            expect(bladTittel(Blad.B)).toBe('Ja, jeg er registert på Blad B')
        })

        it('skal returnere riktig tittel for Blad.Ingen', () => {
            expect(bladTittel(Blad.Ingen)).toBe('Nei, jeg er ikke registert')
        })
    })

    describe('lottHyreBeskrivelse', () => {
        it('skal beskrive BEGGE som både fast hyre og lott', () => {
            expect(lottHyreBeskrivelse(LottOgHyre.BEGGE)).toBe('Du får både fast hyre og lott')
        })

        it('skal beskrive HYRE som fast lønn', () => {
            expect(lottHyreBeskrivelse(LottOgHyre.HYRE)).toBe(
                'Du får fast lønn fra arbeidsgiveren din, som en vanlig ansatt',
            )
        })

        it('skal beskrive LOTT som betaling ut fra fangst', () => {
            expect(lottHyreBeskrivelse(LottOgHyre.LOTT)).toBe(
                'Du får betalt ut fra hva fartøyet fanger - ikke fast lønn',
            )
        })
    })

    describe('lottOgHyreTittel', () => {
        it('skal returnere riktig tittel for BEGGE', () => {
            expect(lottOgHyreTittel(LottOgHyre.BEGGE)).toBe('Både hyre og lott')
        })

        it('skal returnere riktig tittel for HYRE', () => {
            expect(lottOgHyreTittel(LottOgHyre.HYRE)).toBe('Hyre - fast lønn')
        })

        it('skal returnere riktig tittel for LOTT', () => {
            expect(lottOgHyreTittel(LottOgHyre.LOTT)).toBe('Lott - andel av fangsten')
        })
    })
})
