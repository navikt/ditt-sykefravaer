import { BodyShort } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'
import { Flexjar } from '../flexjar/flexjar'
import { Banner } from '../banner/Banner'
import { useToggle } from '../../toggles/context'
import { toReadableDate } from '../../utils/dateUtils'

import { InntektsmeldingPanel } from './InntektsmeldingPanel'
import { UtbetalingOgRefusjonPanel } from './UtbetalingOgRefusjonPanel'
import { Naturalytelser } from './Naturalytelser'
import { ArbeidsgiverperiodePanel } from './ArbeidsgiverperiodePanel'

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding?: InntektsmeldingTyper }) {
    const visNaturalytelser = (inntektsmelding?.opphoerAvNaturalytelser?.length || 0) > 0
    const flexjarToggle = useToggle('flexjar-ditt-sykefravaer-inntektsmelding-visning')

    const { organisasjonsnavn, mottattDato, innsenderFulltNavn } = inntektsmelding || {}

    return (
        <>
            <Banner tittel="Inntektsmelding" utenIkon={true}></Banner>
            {organisasjonsnavn && (
                <BodyShort>
                    <BodyShort as="span" weight="semibold">
                        Arbeidsgiver:
                    </BodyShort>{' '}
                    {organisasjonsnavn}
                </BodyShort>
            )}
            {innsenderFulltNavn && (
                <BodyShort className="mt-1">
                    <BodyShort as="span" weight="semibold">
                        Innsendt av:
                    </BodyShort>{' '}
                    {innsenderFulltNavn}
                </BodyShort>
            )}
            {mottattDato && (
                <BodyShort spacing className="mt-1">
                    <BodyShort as="span" weight="semibold">
                        Dato:
                    </BodyShort>{' '}
                    {toReadableDate(mottattDato)}
                </BodyShort>
            )}
            <BodyShort className="mt-8" spacing>
                <BodyShort weight="semibold">Spørsmål eller feil</BodyShort>
                <BodyShort className="mt-2">
                    Hvis du har spørsmål til opplysningene i inntektsmeldingen, ta kontakt med arbeidsgiveren din.
                </BodyShort>
            </BodyShort>
            <InntektsmeldingPanel inntektsmelding={inntektsmelding} />
            {inntektsmelding && inntektsmelding.arbeidsgiverperioder.length > 0 && (
                <ArbeidsgiverperiodePanel inntektsmelding={inntektsmelding} />
            )}
            <UtbetalingOgRefusjonPanel inntektsmelding={inntektsmelding} />
            {visNaturalytelser && <Naturalytelser inntektsmelding={inntektsmelding} />}
            {flexjarToggle.enabled && <Flexjar feedbackId="inntektsmelding-visning" />}
        </>
    )
}
