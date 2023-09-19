import { BodyShort, Heading, Skeleton } from '@navikt/ds-react'

import { Inntektsmelding } from '../../types/inntektsmelding'

import TextLabel from './TextLabel'

export function Person({ inntektsmelding }: { inntektsmelding?: Inntektsmelding }) {
    const virksomhetsnavn = inntektsmelding?.organisasjonsnavn
    const virksomhetsnummer = inntektsmelding?.virksomhetsnummer
    const innsenderNavn = inntektsmelding?.innsenderNavn
    const innsenderTelefonNr = inntektsmelding?.innsenderTelefonNr
    return (
        <>
            <Heading level="2" size="medium" spacing>
                Arbeidsgiveren
            </Heading>

            <TextLabel>Virksomhetsnavn</TextLabel>
            <BodyShort spacing>{virksomhetsnavn || <Skeleton variant="text" width="90%" height={28} />}</BodyShort>

            <TextLabel>Virksomhetsnummer</TextLabel>
            <BodyShort spacing>{virksomhetsnummer ?? <Skeleton variant="text" width="90%" height={28} />}</BodyShort>

            <TextLabel>Innsender</TextLabel>
            <BodyShort spacing>{innsenderNavn ?? <Skeleton variant="text" width="90%" height={28} />}</BodyShort>

            <TextLabel>Telefon innsender</TextLabel>
            <BodyShort spacing>{innsenderTelefonNr}</BodyShort>
        </>
    )
}
