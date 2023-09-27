import { BodyLong } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'
import { Feedback } from '../feedback/feedback'
import { Banner } from '../banner/Banner'

import { InntektsmeldingPanel } from './InntektsmeldingPanel'
import { UtbetalingOgRefusjonPanel } from './UtbetalingOgRefusjonPanel'
import { Naturalytelser } from './Naturalytelser'

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding?: InntektsmeldingTyper }) {
    const visNaturalytelser = (inntektsmelding?.opphoerAvNaturalytelser?.length || 0) > 0
    return (
        <>
            <Banner tittel="Inntektsmelding" utenIkon={true}></Banner>

            <BodyLong spacing>
                Din arbeidsgiver har sendt inn informasjon om din inntekt og arbeidsforhold. Denne informasjonen
                benyttes til å vurdere din rett til sykepenger og foreta en nøyaktig beregning av sykepengegrunnlaget
                ditt.
            </BodyLong>

            <InntektsmeldingPanel inntektsmelding={inntektsmelding} />

            <UtbetalingOgRefusjonPanel inntektsmelding={inntektsmelding} />

            {visNaturalytelser && <Naturalytelser inntektsmelding={inntektsmelding} />}

            <BodyLong className="mt-8" spacing>
                Hvis du har spørsmål til de opplysningene du ser her, eller noe er feil, må du kontakte arbeidsgiveren
                din.
            </BodyLong>

            <Feedback feedbackId="inntektsmelding-visning" />
        </>
    )
}
