import React, { ReactElement } from 'react'

import { Blad, LottOgHyre } from '../../../../../../types/sykmeldingCommon'
import { Sykmelding } from '../../../../../../types/sykmelding'
import { SectionWrapper } from '../../../../../FormComponents/FormStructure'
import ArbeidsgiverSection from '../../Arbeidsgiver/ArbeidsgiverSection'
import ArbeidsgivereFiskerMissingInfo from '../../Arbeidsgiver/ArbeidsgivereFiskerMissingInfo'
import { Brukerinformasjon } from '../../../../../../hooks/useBrukerinformasjonById'

interface Props {
    sykmelding: Sykmelding
    brukerinformasjon: Brukerinformasjon
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
