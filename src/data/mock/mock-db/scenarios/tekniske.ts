import { StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { SykmeldingBuilder } from '../data-creators'
import { ScenarioCreator } from '../scenario-types'

export const sykmeldingFeilEtterNavigasjon: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

export const brukerinfoFeil: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

export const feilmelding: ScenarioCreator = () => ({
    sykmeldinger: [],
})
