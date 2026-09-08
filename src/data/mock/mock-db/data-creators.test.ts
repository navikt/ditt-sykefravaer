import { describe, expect, it } from 'vitest'

import { dateAdd } from '../../../utils/dato-utils'
import { StatusEvent } from '../../../types/sykmelding/sykmelding'
import { SykmeldingBuilder, testDato } from './data-creators'

describe('SykmeldingBuilder', () => {
    it('setter alle relevante tidspunkt til samme offsetdato', () => {
        const sykmelding = new SykmeldingBuilder(-2)
            .enkelPeriode({ offset: 0, days: 7 })
            .status(StatusEvent.APEN)
            .build()

        const forventetDato = dateAdd(testDato, { days: -2 })

        expect(sykmelding.mottattTidspunkt).toBe(forventetDato)
        expect(sykmelding.behandletTidspunkt).toBe(forventetDato)
        expect(sykmelding.sykmeldingStatus.timestamp).toBe(forventetDato)
    })
})
