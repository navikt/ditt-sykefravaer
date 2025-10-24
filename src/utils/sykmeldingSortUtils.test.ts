import { describe, it, expect } from 'vitest'

import { StatusEvent, SykmeldingStatus } from '../types/sykmelding/sykmelding'

import { sortSykmeldingerByArbeidsgiver } from './sykmeldingSortUtils'
import { createSykmelding } from './test/dataUtils'

describe('sortSykmeldingerByArbeidsgiver', () => {
    it('should sort by orgNavn', () => {
        const result = sortSykmeldingerByArbeidsgiver([
            createSykmelding({
                sykmeldingStatus: createSykmeldingStatusWithArbeidsgiver('Garbeidsgiver'),
            }),
            createSykmelding({
                sykmeldingStatus: createSykmeldingStatusWithArbeidsgiver('Arbeidsgiversen'),
            }),
            createSykmelding({
                sykmeldingStatus: createSykmeldingStatusWithArbeidsgiver('Ågardsson Arbeidsgiver'),
            }),
        ])

        expect(result.map((sykmelding) => sykmelding.sykmeldingStatus.arbeidsgiver?.orgNavn)).toEqual([
            'Arbeidsgiversen',
            'Garbeidsgiver',
            'Ågardsson Arbeidsgiver',
        ])
    })
})

function createSykmeldingStatusWithArbeidsgiver(orgNavn: string): SykmeldingStatus {
    return {
        timestamp: '2020-01-01',
        statusEvent: StatusEvent.APEN,
        arbeidsgiver: {
            orgNavn,
            orgnummer: '123',
        },
    }
}
