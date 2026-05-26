import { ReactElement } from 'react'
import { Alert, Button, Skeleton } from '@navikt/ds-react'

import useHarSoknad from '../../hooks/sykmelding/useHarSoknad'
import useOptIn from '../../hooks/sykmelding/useOptIn'

export function OptIn({
    sykmeldingId,
    enabled,
    onOptInSuccess,
}: {
    sykmeldingId: string
    enabled: boolean
    onOptInSuccess?: () => void
}): ReactElement {
    const {
        data: harSoknadData,
        isLoading: harSoknadLoading,
        isError: harSoknadError,
    } = useHarSoknad(sykmeldingId, enabled)
    const { mutate: optIn, isPending: optInPending, isError: optInError } = useOptIn(sykmeldingId)

    if (harSoknadLoading) {
        return <Skeleton width="100%" />
    }

    if (harSoknadError || optInError) {
        return (
            <Alert variant="error" className="mt-4" size="small">
                Beklager, en feil oppstod. Vennligst prøv igjen senere.
            </Alert>
        )
    }

    if (harSoknadData?.harSoknad) {
        return (
            <Alert variant="info" className="mt-4" role="alert" aria-live="polite" size="small">
                Du har en søknad for denne perioden.
            </Alert>
        )
    }

    return (
        <Button
            variant="secondary-neutral"
            size="small"
            loading={optInPending}
            onClick={() => optIn(undefined, { onSuccess: onOptInSuccess })}
        >
            Jeg vil søke om sykepenger
        </Button>
    )
}
