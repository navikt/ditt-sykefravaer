import { expect, describe, it } from 'vitest'
import { subDays } from 'date-fns'

import { StatusEvent } from '../../../types/sykmelding/sykmelding'
import { toDate } from '../../../utils/dato-utils'

import { e2eScenarios, otherScenarios, simpleScenarios } from './scenarios'

describe('e2e-scenarios', () => {
    it('buttAgainstAvventende skal være butt-i-butt', () => {
        const { sykmeldinger } = e2eScenarios.buttAgainstAvventende.scenario()

        const firstTom = toDate(sykmeldinger[0].sykmeldingsperioder[0].tom)
        const lastFom = toDate(sykmeldinger[1].sykmeldingsperioder[0].fom)

        expect(firstTom).toEqual(subDays(lastFom, 1))
    })

    it('unsentButtAgainstNormal være butt-i-butt', () => {
        const { sykmeldinger } = e2eScenarios.unsentButtAgainstNormal.scenario()

        const firstTom = toDate(sykmeldinger[0].sykmeldingsperioder[0].tom)
        const lastFom = toDate(sykmeldinger[1].sykmeldingsperioder[0].fom)

        expect(sykmeldinger[0].sykmeldingStatus.statusEvent).toEqual(StatusEvent.SENDT)
        expect(sykmeldinger[1].sykmeldingStatus.statusEvent).toEqual(StatusEvent.APEN)
        expect(firstTom).toEqual(subDays(lastFom, 1))
    })
})

describe('other-scenarios', () => {
    it('avventene skal være åpen og ikke egenmeldt', () => {
        const { sykmeldinger } = simpleScenarios.avventene.scenario()

        expect(sykmeldinger).toHaveLength(1)
        expect(sykmeldinger[0].sykmeldingStatus.statusEvent).toEqual(StatusEvent.APEN)
        expect(sykmeldinger[0].egenmeldt).toBeFalsy()
    })

    it('egenmeldt skal være åpen og egenmeldt', () => {
        const { sykmeldinger } = otherScenarios.egenmeldt.scenario()

        expect(sykmeldinger).toHaveLength(1)
        expect(sykmeldinger[0].sykmeldingStatus.statusEvent).toEqual(StatusEvent.APEN)
        expect(sykmeldinger[0].egenmeldt).toBe(true)
    })

    it('usendtMedTidligereSent skal ha sendt eldste og åpen nyeste', () => {
        const { sykmeldinger } = simpleScenarios.usendtMedTidligereSent.scenario()

        expect(sykmeldinger).toHaveLength(2)
        expect(sykmeldinger[0].sykmeldingStatus.statusEvent).toEqual(StatusEvent.SENDT)
        expect(sykmeldinger[1].sykmeldingStatus.statusEvent).toEqual(StatusEvent.APEN)
    })
})
