import { ReactElement } from 'react'
import { Alert, BodyLong, Heading } from '@navikt/ds-react'

function ArbeidsgivereFiskerMissingInfo(): ReactElement {
    return (
        <Alert className="mt-4" variant="warning" role="status">
            <Heading spacing size="small" level="2">
                Vi finner ingen arbeidsforhold registrert på deg
            </Heading>
            <BodyLong spacing>
                Dette vil gjelde en del fiskere på hyre, da arbeidsgiver ikke har plikt til å melde inn
                arbeidsforholdet. Hvis du er usikker på om det er riktig i ditt tilfelle, kan du ta kontakt med
                arbeidsgiveren din.
            </BodyLong>
            <BodyLong>
                Hvis det stemmer at arbeidsforholdet ditt ikke skal registreres, kan du sende inn sykmeldingen til NAV
                som fisker ved å velge lott i stedet for hyre.
            </BodyLong>
        </Alert>
    )
}

export default ArbeidsgivereFiskerMissingInfo
