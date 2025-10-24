import React, { ReactElement } from 'react'

import { Sykmelding } from '../../../../../types/sykmelding'
import { BrukerinformasjonFragment } from '../../../../../hooks/useBrukerinformasjonById'

import ArbeidsgivereMissingInfo from './ArbeidsgivereMissingInfo'
import ArbeidsgiverSection from './ArbeidsgiverSection'

type Props = {
    sykmelding: Sykmelding
    arbeidsgivere: BrukerinformasjonFragment['arbeidsgivere']
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
