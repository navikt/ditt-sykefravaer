import React, { ReactElement } from 'react'

import { Blad, BrukerinformasjonFragment, LottOgHyre, SykmeldingFragment } from 'src/fetching/graphql.generated'

import { SectionWrapper } from '../../../../../FormComponents/FormStructure'
import ArbeidsgiverSection from '../../Arbeidsgiver/ArbeidsgiverSection'
import ArbeidsgivereFiskerMissingInfo from '../../Arbeidsgiver/ArbeidsgivereFiskerMissingInfo'

interface Props {
    sykmelding: SykmeldingFragment
    brukerinformasjon: BrukerinformasjonFragment
    metadata: {
        blad: Blad | null
        lottOgHyre: LottOgHyre | null
    }
}

function FiskerArbeidstakerSection({ sykmelding, brukerinformasjon }: Props): ReactElement {
    return (
        <SectionWrapper>
            <ArbeidsgiverSection sykmelding={sykmelding} arbeidsgivere={brukerinformasjon.arbeidsgivere} />
            {brukerinformasjon.arbeidsgivere.length === 0 && <ArbeidsgivereFiskerMissingInfo />}
        </SectionWrapper>
    )
}

export default FiskerArbeidstakerSection
