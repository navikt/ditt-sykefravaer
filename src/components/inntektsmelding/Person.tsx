import { Skeleton } from '@navikt/ds-react'

import { Inntektsmelding } from '../../types/inntektsmelding'

import TextLabel from './TextLabel'
import Heading3 from './Heading3'

export function Person({ inntektsmelding }: { inntektsmelding?: Inntektsmelding }) {
    const virksomhetsnavn = inntektsmelding?.organisasjonsnavn
    const virksomhetsnummer = inntektsmelding?.virksomhetsnummer
    const innsenderNavn = inntektsmelding?.innsenderNavn
    const innsenderTelefonNr = inntektsmelding?.innsenderTelefonNr
    return (
        <>
            <div>
                <div>
                    <Heading3>Arbeidsgiveren</Heading3>

                    <div>
                        <div>
                            <TextLabel>Virksomhetsnavn</TextLabel>
                            <div data-cy="virksomhetsnavn">
                                {virksomhetsnavn || <Skeleton variant="text" width="90%" height={28} />}
                            </div>
                        </div>
                        <div>
                            <TextLabel>Virksomhetsnummer</TextLabel>
                            <div data-cy="orgnummer">
                                {virksomhetsnummer ?? <Skeleton variant="text" width="90%" height={28} />}
                            </div>
                        </div>
                        <div>
                            <TextLabel>Innsender</TextLabel>
                            <div data-cy="innsendernavn">
                                {innsenderNavn ?? <Skeleton variant="text" width="90%" height={28} />}
                            </div>
                        </div>
                        <div>
                            <>
                                <TextLabel>Telefon innsender</TextLabel>
                                <div data-cy="innsendertlf">{innsenderTelefonNr}</div>
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
