import { describe, it, expect } from 'vitest'

import { ArbeidssituasjonType } from '../types/sykmelding/sykmeldingCommon'
import { TidligereArbeidsgivereArray } from '../hooks/useTidligereArbeidsgivereById'

import { isArbeidstaker, isFrilanserOrNaeringsdrivendeOrJordbruker } from './arbeidssituasjonUtils'
import { deduplisterteArbeidsgivere } from './arbeidsgiverUtils'

describe('arbeidssituasjonUtils', () => {
    describe('isArbeidstaker', () => {
        it('should return true if arbeidssituasjon is ARBEIDSTAKER', () => {
            expect(isArbeidstaker(ArbeidssituasjonType.ARBEIDSTAKER)).toBe(true)
        })

        it('should return true if arbeidssituasjon is other than ARBEIDSTAKER', () => {
            expect(isArbeidstaker(ArbeidssituasjonType.PERMITTERT)).toBe(false)
        })
    })

    describe('isFrilanserOrNaeringsdrivende', () => {
        it('should return true if arbeidssituasjon is FRILANSER or NARINGSDRIVENDE or JORDBRUKER', () => {
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.FRILANSER)).toBe(true)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.NAERINGSDRIVENDE)).toBe(true)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.JORDBRUKER)).toBe(true)
        })

        it('should return false if arbeidssituasjon is other than FRILANSER or NAERINGSDRIVENDE or JORDBRUKER', () => {
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.ARBEIDSTAKER)).toBe(false)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.ANNET)).toBe(false)
            expect(isFrilanserOrNaeringsdrivendeOrJordbruker(ArbeidssituasjonType.FISKER)).toBe(false)
        })
    })

    describe('deduplisterteArbeidsgivere', () => {
        it('should remove duplicates based on prettified org name and orgnummer', () => {
            const arbeidsgivere: TidligereArbeidsgivereArray = [
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
