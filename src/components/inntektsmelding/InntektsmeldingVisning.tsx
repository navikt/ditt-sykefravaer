import { BodyLong } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'
import { Flexjar } from '../flexjar/flexjar'
import { Banner } from '../banner/Banner'
import { useToggle } from '../../toggles/context'

import { InntektsmeldingPanel } from './InntektsmeldingPanel'
import { UtbetalingOgRefusjonPanel } from './UtbetalingOgRefusjonPanel'
import { Naturalytelser } from './Naturalytelser'
import { ArbeidsgiverperiodePanel } from './ArbeidsgiverperiodePanel'

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding?: InntektsmeldingTyper }) {
    const visNaturalytelser = (inntektsmelding?.opphoerAvNaturalytelser?.length || 0) > 0
    const flexjarToggle = useToggle('flexjar-ditt-sykefravaer-inntektsmelding-visning')

    return (
        <>
            <Banner tittel="Inntektsmelding" utenIkon={true}></Banner>

            <BodyLong spacing>
                Din arbeidsgiver har sendt inn informasjon om din inntekt og arbeidsforhold. Denne informasjonen
                benyttes til å vurdere din rett til sykepenger og foreta en nøyaktig beregning av sykepengegrunnlaget
                ditt.
            </BodyLong>

            <InntektsmeldingPanel inntektsmelding={inntektsmelding} />
            {inntektsmelding && inntektsmelding.arbeidsgiverperioder.length > 0 && (
                <ArbeidsgiverperiodePanel inntektsmelding={inntektsmelding} />
            )}
            <UtbetalingOgRefusjonPanel inntektsmelding={inntektsmelding} />

            {visNaturalytelser && <Naturalytelser inntektsmelding={inntektsmelding} />}

            <BodyLong className="mt-8" spacing>
                Hvis du har spørsmål til de opplysningene du ser her, eller noe er feil, må du kontakte arbeidsgiveren
                din.
            </BodyLong>

            {flexjarToggle.enabled && <Flexjar feedbackId="inntektsmelding-visning" />}
        </>
    )
}
