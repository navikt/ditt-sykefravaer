import { expect, describe, it } from 'vitest'
import { subDays } from 'date-fns'

import { StatusEvent } from '../../../types/sykmelding/sykmelding'
import { toDate } from '../../../utils/dato-utils'

import { e2eScenarios, isValidScenario, scenarios, synligeScenarioGrupper, tekniskeScenarioer } from './scenarios'

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

describe('scenario-register-kontrakt', () => {
    const alleSynligeNøkler = Object.values(synligeScenarioGrupper).flatMap((gruppe) => Object.keys(gruppe))

    it('skal ikke ha duplikater mellom scenario-gruppene', () => {
        const scenarioGrupper = [
            ['synligeScenarioGrupper', alleSynligeNøkler],
            ['tekniskeScenarioer', Object.keys(tekniskeScenarioer)],
            ['e2eScenarios', Object.keys(e2eScenarios)],
        ] as const

        const nøkkelOpphav = new Map<string, string[]>()

        scenarioGrupper.forEach(([gruppenavn, nøkler]) => {
            nøkler.forEach((nøkkel) => {
                const opphav = nøkkelOpphav.get(nøkkel) ?? []
                opphav.push(gruppenavn)
                nøkkelOpphav.set(nøkkel, opphav)
            })
        })

        const duplikater = [...nøkkelOpphav.entries()].filter(([, opphav]) => opphav.length > 1)

        expect(duplikater).toEqual([])
    })

    it('skal ha nøyaktig samme nøkler i flat eksport som unionen av gruppene', () => {
        const grupperteNøkler = [...alleSynligeNøkler, ...Object.keys(tekniskeScenarioer), ...Object.keys(e2eScenarios)]

        const forventetNøkkelsett = [...new Set(grupperteNøkler)].sort()
        const flateNøkler = [...new Set(Object.keys(scenarios))].sort()

        expect(flateNøkler).toEqual(forventetNøkkelsett)
    })

    it('skal godkjenne alle kjente scenarionøkler og avvise ukjent nøkkel', () => {
        Object.keys(scenarios).forEach((nøkkel) => {
            expect(isValidScenario(nøkkel)).toBe(true)
        })

        expect(isValidScenario('ikke-en-gyldig-nokkel')).toBe(false)
    })

    it('skal låse den norske fire-gruppers-inndelingen av synlige scenarioer', () => {
        const forventedeGruppenøkler = ['grunnleggende', 'periodetyper', 'statusOgUnntak', 'historikkOgKvittering']

        expect(Object.keys(synligeScenarioGrupper)).toEqual(forventedeGruppenøkler)

        forventedeGruppenøkler.forEach((gruppenøkkel) => {
            expect(tekniskeScenarioer).not.toHaveProperty(gruppenøkkel)
            expect(e2eScenarios).not.toHaveProperty(gruppenøkkel)
        })
    })
})
