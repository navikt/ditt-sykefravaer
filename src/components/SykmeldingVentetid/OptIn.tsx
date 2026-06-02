import { ReactElement } from 'react'
import { Alert, BodyShort, Button, Heading, Skeleton } from '@navikt/ds-react'
import Link from 'next/link'
import { isAfter } from 'date-fns'

import useHarSoknad from '../../hooks/sykmelding/useHarSoknad'
import useOptIn from '../../hooks/sykmelding/useOptIn'

export function OptIn({
    sykmeldingId,
    enabled,
    optInFrist,
}: {
    sykmeldingId: string
    enabled: boolean
    optInFrist: Date
}): ReactElement {
    const {
        data: harSoknadData,
        isLoading: harSoknadLoading,
        isError: harSoknadError,
    } = useHarSoknad(sykmeldingId, enabled)
    const {
        mutate: optIn,
        isPending: optInPending,
        isError: optInError,
        isSuccess: optInSuccess,
    } = useOptIn(sykmeldingId)

    const sykmeldingNyereEnn4Mnd = isAfter(optInFrist, new Date())

    if (harSoknadLoading) {
        return <Skeleton width="100%" />
    }

    if (harSoknadError || optInError) {
        return (
            <Alert variant="error" size="small">
                Beklager, en feil oppstod. Vennligst prøv igjen senere.
            </Alert>
        )
    }

    if (harSoknadData?.harSoknad) {
        return (
            <Alert variant="info" role="alert" aria-live="polite" size="small">
                <Heading size="small" level="3" spacing>
                    Vi har opprettet søknad for denne perioden
                </Heading>
                <BodyShort>
                    Du vil få beskjed av oss når du skal fylle ut og sende inn søknaden om sykepenger for
                    sykmeldingsperioden.
                </BodyShort>
            </Alert>
        )
    }

    if (optInSuccess) {
        return (
            <Alert variant="info" className="mt-4" role="alert" aria-live="polite" size="small">
                <Heading size="small" level="3" spacing>
                    Vi oppretter søknad etter sykmeldingsperioden er over
                </Heading>
                <BodyShort>
                    Du vil få beskjed av oss når du skal fylle ut og sende inn søknaden om sykepenger for
                    sykmeldingsperioden.
                </BodyShort>
            </Alert>
        )
    }

    if (!sykmeldingNyereEnn4Mnd) {
        return (
            <Alert variant="info" role="alert" aria-live="polite" size="small">
                <Heading size="small" level="3" spacing>
                    Søknadsfristen er gått ut
                </Heading>
                <BodyShort>
                    Hvis du mener at dette er feil, kan du{' '}
                    <Link href="https://www.nav.no/kontaktoss" target="_blank">
                        kontakte Nav
                    </Link>{' '}
                    for å få hjelp.
                </BodyShort>
            </Alert>
        )
    }

    return (
        <Button variant="secondary-neutral" size="small" loading={optInPending} onClick={() => optIn()}>
            Jeg vil søke om sykepenger
        </Button>
    )
}
