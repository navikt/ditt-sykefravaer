import React, { ReactElement } from 'react'

import { Sykmelding } from '../../../../../types/sykmelding/sykmelding'
import { Arbeidsgiver } from '../../../../../hooks/sykmelding/useBrukerinformasjonById'

import ArbeidsgivereMissingInfo from './ArbeidsgivereMissingInfo'
import ArbeidsgiverSection from './ArbeidsgiverSection'

type Props = {
    sykmelding: Sykmelding
    arbeidsgivere: Arbeidsgiver[]
}

function AnsattArbeidstakerSection({ sykmelding, arbeidsgivere }: Props): ReactElement {
    return (
        <div>
            <ArbeidsgiverSection sykmelding={sykmelding} arbeidsgivere={arbeidsgivere} />
            {arbeidsgivere.length === 0 && <ArbeidsgivereMissingInfo />}
        </div>
    )
}

export default AnsattArbeidstakerSection
