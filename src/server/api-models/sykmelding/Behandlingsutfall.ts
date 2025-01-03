// Anta at RegelStatus er en enum du importerer
// import { RegelStatus } from '../../../fetching/graphql.generated';

import { RegelStatus } from '../../../fetching/graphql.generated'

export interface RuleHit {
    messageForSender: string
    messageForUser: string
    ruleName: string
    ruleStatus: RegelStatus
}

export interface Behandlingsutfall {
    status: RegelStatus
    ruleHits: RuleHit[]
}
