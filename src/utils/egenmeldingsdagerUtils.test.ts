import { describe, it, expect } from 'vitest'

import { YesOrNo } from '../types/sykmelding/sykmeldingCommon'

import { hasCompletedEgenmeldingsdager } from './egenmeldingsdagerUtils'

describe('hasCompletedEgenmeldingsdager', () => {
    it('skal returnere true hvis harPerioder er NEI med én periode', () => {
        const egenmeldingsperioder = [
            {
                harPerioder: YesOrNo.NO,
                datoer: null,
                hasClickedVidere: null,
            },
        ]
        expect(hasCompletedEgenmeldingsdager(egenmeldingsperioder)).toBe(true)
    })

    it('skal returnere false hvis harPerioder er JA med én periode', () => {
        const egenmeldingsperioder = [
            {
                harPerioder: YesOrNo.YES,
                datoer: null,
                hasClickedVidere: null,
            },
        ]
        expect(hasCompletedEgenmeldingsdager(egenmeldingsperioder)).toBe(false)
    })

    it('skal returnere true hvis harPerioder er NEI i den siste perioden', () => {
        const egenmeldingsperioder = [
            {
                harPerioder: YesOrNo.YES,
                datoer: null,
                hasClickedVidere: null,
            },
            {
                harPerioder: YesOrNo.YES,
                datoer: null,
                hasClickedVidere: null,
            },
            {
                harPerioder: YesOrNo.NO,
                datoer: null,
                hasClickedVidere: null,
            },
        ]
        expect(hasCompletedEgenmeldingsdager(egenmeldingsperioder)).toBe(true)
    })

    it('skal returnere false hvis harPerioder er JA i den siste perioden', () => {
        const egenmeldingsperioder = [
            {
                harPerioder: YesOrNo.YES,
                datoer: null,
                hasClickedVidere: null,
            },
            {
                harPerioder: YesOrNo.YES,
                datoer: null,
                hasClickedVidere: null,
            },
            {
                harPerioder: YesOrNo.YES,
                datoer: null,
                hasClickedVidere: null,
            },
        ]
        expect(hasCompletedEgenmeldingsdager(egenmeldingsperioder)).toBe(false)
    })
})
