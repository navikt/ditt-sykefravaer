import React, { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'

import { Sykmelding } from '../../../../../types/sykmelding/sykmelding'
import { SectionWrapper } from '../../../../FormComponents/FormStructure'
import { FormValues } from '../../../SendSykmeldingForm'
import { Brukerinformasjon } from '../../../../../types/sykmelding/brukerinformasjon'

import BladField from './BladField'
import LottOgHyreField from './LottOgHyreField'
import FiskerArbeidstakerSection from './FiskerArbeidstaker/FiskerArbeidstakerSection'
import FiskerSelvstendigSection from './FiskerSelvstendig/FiskerSelvstendigSection'
import { BodyShort, ReadMore } from '@navikt/ds-react'

type Props = {
    sykmelding: Sykmelding
    brukerinformasjon: Brukerinformasjon
}

/**
 * Fisker-flyt, består av 6 ulike permutasjoner av blad og lott/hyre
 *
 * Blad A+LOTT = selvstending næringsdrivende flyt MED forsikringsspørsmål
 * Blad B+LOTT = ingen ekstra spørsmål
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
        <SectionWrapper title="Er du registrert som Blad B i Fiskerregisteret?" size={'small'}>
            <ReadMore header="Hva er Fiskerregisteret?">
                <BodyShort spacing>
                    Fiskerregisteret er et register over personer i Norge som har fiske som hovednæring eller binæring.
                    Registeret er delt i to blad:
                </BodyShort>
                <BodyShort spacing>
                    Blad B er for deg som har fiske som hovednæring. Blad A er for deg som har fiske som binæring ved
                    siden av en annen jobb.
                </BodyShort>
                <BodyShort spacing>
                    Er du usikker på om du er registrert, eller hvilket blad du står på? Du kan sjekke på
                    Fiskerregisteret.
                </BodyShort>
            </ReadMore>
            <BladField />
            {blad != null && <LottOgHyreField />}
            {lottOgHyre === 'LOTT' && blad === 'A' && <FiskerSelvstendigSection sykmelding={sykmelding} />}
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
