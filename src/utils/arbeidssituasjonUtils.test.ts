import { describe, it, expect } from 'vitest'

import { ArbeidssituasjonType } from '../types/sykmelding/sykmeldingCommon'
import { TidligereArbeidsgiver } from '../types/sykmelding/tidligereArbeidsgiver'

import { isArbeidstaker, isFrilanserOrNaeringsdrivendeOrJordbruker } from './arbeidssituasjonUtils'
import { deduplisterteArbeidsgivere } from './arbeidsgiverUtils'

describe('arbeidssituasjonUtils', () => {
    describe('isArbeidstaker', () => {
        it('skal returnere true hvis arbeidssituasjon er ARBEIDSTAKER', () => {
            expect(isArbeidstaker(ArbeidssituasjonType.ARBEIDSTAKER)).toBe(true)
        })

        it('skal returnere true hvis arbeidssituasjon er noe annet enn ARBEIDSTAKER', () => {
            expect(isArbeidstaker(ArbeidssituasjonType.PERMITTERT)).toBe(false)
        })
    })

    describe('isFrilanserOrNaeringsdrivende', () => {
        it('skal returnere true hvis arbeidssituasjon er FRILANSER eller NARINGSDRIVENDE eller JORDBRUKER', () => {
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.FRILANSER)).toBe(true)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.NAERINGSDRIVENDE)).toBe(true)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.JORDBRUKER)).toBe(true)
        })

        it('skal returnere false hvis arbeidssituasjon er noe annet enn FRILANSER eller NAERINGSDRIVENDE eller JORDBRUKER', () => {
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.ARBEIDSTAKER)).toBe(false)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.ANNET)).toBe(false)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.FISKER)).toBe(false)
        })
    })

    describe('deduplisterteArbeidsgivere', () => {
        it('skal fjerne duplikater basert på prettifisert organisasjonsnavn og orgnummer', () => {
            const arbeidsgivere: TidligereArbeidsgiver[] = [
                { orgNavn: 'Firma AS', orgnummer: '123' },
                { orgNavn: 'firma as', orgnummer: '123' }, // same orgNavn, liten/stor bokstav
                { orgNavn: 'Firma AS', orgnummer: '456' }, // samme orgNavn, annet orgnummer
                { orgNavn: 'Annet AS', orgnummer: '789' },
            ]

            const result = deduplisterteArbeidsgivere(arbeidsgivere)
            expect(result).toEqual([
                { orgNavn: 'Firma AS', orgnummer: '123' },
                { orgNavn: 'Firma AS', orgnummer: '456' },
                { orgNavn: 'Annet AS', orgnummer: '789' },
            ])
        })
    })
})
