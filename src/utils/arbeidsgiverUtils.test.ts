import { describe, it, expect } from 'vitest'

import { Arbeidsgiver } from '../types/sykmelding/brukerinformasjon'

import { findValgtArbeidsgiver } from './arbeidsgiverUtils'

describe('arbeidsgiverUtils', () => {
    describe('findValgtArbeidsgiver', () => {
        it('skal returnere arbeidsgiver hvis gitt orgnummer samsvarer', () => {
            const arbeidsgivere: Arbeidsgiver[] = [
                {
                    __typename: 'Arbeidsgiver',
                    naermesteLeder: {
                        __typename: 'NaermesteLeder',
                        navn: 'Lise',
                    },
                    navn: 'Vaskeri AS',
                    orgnummer: '78453253',
                    aktivtArbeidsforhold: true,
                },
                {
                    __typename: 'Arbeidsgiver',
                    naermesteLeder: {
                        __typename: 'NaermesteLeder',
                        navn: 'Knut',
                    },
                    navn: 'Snill Torpedo',
                    orgnummer: '84093212',
                    aktivtArbeidsforhold: true,
                },
            ]
            const orgnummer = '84093212'
            expect(findValgtArbeidsgiver(arbeidsgivere, orgnummer)).toBe(arbeidsgivere[1])
        })

        it('skal returnere undefined hvis gitt orgnummer ikke finnes i arbeidsgiver-listen', () => {
            const arbeidsgivere: Arbeidsgiver[] = [
                {
                    __typename: 'Arbeidsgiver',
                    naermesteLeder: {
                        __typename: 'NaermesteLeder',
                        navn: 'Lise',
                    },
                    navn: 'Vaskeri AS',
                    orgnummer: '78453253',
                    aktivtArbeidsforhold: true,
                },
            ]
            const orgnummer = '9894224'
            expect(findValgtArbeidsgiver(arbeidsgivere, orgnummer)).toBe(undefined)
        })
    })
})
