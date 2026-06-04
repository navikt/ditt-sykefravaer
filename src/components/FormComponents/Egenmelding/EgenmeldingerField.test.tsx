import { describe, it, expect } from 'vitest'

import { toDate } from '../../../utils/dateUtils'
import { YesOrNo } from '../../../types/sykmelding/sykmeldingCommon'

import { laterPeriodsRemoved } from './EgenmeldingerField'

describe('EgenmeldingerField', () => {
    describe('rediger periode', () => {
        it('skal fjerne perioder etter redigering av periode basert på indeks', () => {
            const egenmeldingsdager = [
                {
                    harPerioder: YesOrNo.YES,
                    datoer: [toDate('2022-12-08'), toDate('2022-12-09')],
                    hasClickedVidere: true,
                },
                {
                    harPerioder: YesOrNo.YES,
                    datoer: [toDate('2022-11-24'), toDate('2022-11-25')],
                    hasClickedVidere: true,
                },
                {
                    harPerioder: YesOrNo.YES,
                    datoer: [toDate('2022-11-19')],
                    hasClickedVidere: true,
                },
            ]
            expect(laterPeriodsRemoved(1, false, egenmeldingsdager)).toEqual([
                egenmeldingsdager[0],
                egenmeldingsdager[1],
            ])
        })
    })
})
