import { MuterbarSykmelding } from '../../../server/api-models/sykmelding/MuterbarSykmelding'

export type ScenarioCreator = () => Scenario

export type Scenario = {
    sykmeldinger: MuterbarSykmelding[]
    error?: { message: string }
}
