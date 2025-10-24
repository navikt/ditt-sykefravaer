import React, { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'

import { Sykmelding } from '../../../../../types/sykmelding/sykmelding'
import { SectionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'
import { Brukerinformasjon } from '../../../../../hooks/sykmelding/useBrukerinformasjonById'

import BladField from './BladField'
import LottOgHyreField from './LottOgHyreField'
import FiskerArbeidstakerSection from './FiskerArbeidstaker/FiskerArbeidstakerSection'
import FiskerSelvstendigSection from './FiskerSelvstendig/FiskerSelvstendigSection'

type Props = {
    sykmelding: Sykmelding
    brukerinformasjon: Brukerinformasjon
}

/**
 * Fisker-flyt, består av 6 ulike permutasjoner av blad og lott/hyre
 *
 * Blad A+LOTT = selvstending næringsdrivende flyt MED forsikringsspørsmål
 * Blad B+LOTT = selvstending næringsdrivende flyt UTEN forsikringsspørsmål
 *
 * Blad A+HYRE = arbeidstaker - vanlig flyt
 * Blad B+HYRE = arbeidstaker - vanlig flyt
 * Blad A+BEGGE = arbeidstaker - vanlig flyt
 * Blad B+BEGGE = arbeidstaker - vanlig flyt
 *
 * Isteden for at denne logikken er sentralisert i parent-komponenten, så er det
 * løst med komposisjon. Det betyr at alle "leaf-nodes" i state-"treet" har sin egen
 * oppsummering om hva som sendes f.eks til arbeidsgiver.
 */
function FiskerSection({ brukerinformasjon, sykmelding }: Props): ReactElement {
    const { watch } = useFormContext<FormValues>()
    const [blad, lottOgHyre] = watch(['fisker.blad', 'fisker.lottOgHyre'])

    return (
        <SectionWrapper>
            <BladField />
            {blad != null && <LottOgHyreField />}
            {lottOgHyre === 'LOTT' && <FiskerSelvstendigSection sykmelding={sykmelding} askForsikring={blad === 'A'} />}
            {(lottOgHyre === 'HYRE' || lottOgHyre === 'BEGGE') && (
                <FiskerArbeidstakerSection
                    sykmelding={sykmelding}
                    brukerinformasjon={brukerinformasjon}
                    metadata={{
                        blad,
                        lottOgHyre,
                    }}
                />
            )}
        </SectionWrapper>
    )
}

export default FiskerSection
