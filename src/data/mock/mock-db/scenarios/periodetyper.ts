import { Periodetype, StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { SykmeldingBuilder } from '../data-creators'
import { ScenarioCreator } from '../scenario-types'

export const gradertPeriode: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .status(StatusEvent.APEN)
            .relativePeriode(
                {
                    type: Periodetype.GRADERT,
                    gradert: {
                        grad: 60,
                        reisetilskudd: false,
                    },
                },
                { offset: 0, days: 14 },
            )
            .build(),
    ],
})

export const behandlingsdager: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .relativePeriode({ type: Periodetype.BEHANDLINGSDAGER, behandlingsdager: 1 }, { offset: 0, days: 1 })
            .status(StatusEvent.APEN)
            .build(),
    ],
})

export const avventene: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .relativePeriode(
                { type: Periodetype.AVVENTENDE, tilrettelegging: 'Bedre transport til jobb' },
                { offset: 0, days: 7 },
            )
            .status(StatusEvent.APEN)
            .egenmeldt()
            .build(),
    ],
})

export const reisetilskudd: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .relativePeriode({ type: Periodetype.REISETILSKUDD }, { offset: 0, days: 7 })
            .status(StatusEvent.APEN)
            .egenmeldt()
            .build(),
    ],
})

export const flerePerioder: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(0)
            .status(StatusEvent.APEN)
            .enkelPeriode({ offset: 0, days: 7 })
            .enkelPeriode({ offset: -7, days: 7 })
            .build(),
    ],
})
