import { RegelStatus } from '../../../types/sykmelding/sykmelding'

export interface RuleHit {
    messageForSender: string
    messageForUser: string
    ruleName: string
    ruleStatus: RegelStatus
}

export interface Behandlingsutfall {
    status: RegelStatus
    ruleHits: RuleHit[]
    erUnderBehandling: boolean
}
