import { Button, Heading, InfoCard, Skeleton } from '@navikt/ds-react'
import { XMarkOctagonIcon } from '@navikt/aksel-icons'
import React from 'react'
import { useRouter } from 'next/router'

import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import useMeldinger from '../../hooks/useMeldinger'
import { ForelagtInntektFraAordningen } from '../../components/opplysningerFraAordningen/hentetFraAordningen'
import { skapMeldinger } from '../../components/oppgaver/meldinger'
import { EnkeltOppgaveAlert } from '../../components/oppgaver/Oppgaver'
import { FetchError } from '../../utils/fetch'
import { basePath } from '../../utils/environment'

export interface Inntekt {
    maned: string
    belop: number | null
}

const Beskjed = () => {
    const router = useRouter()
    const { id } = router.query

    const {
        data: meldinger,
        isPending: meldingerLaster,
        isError: meldingerFeilet,
        error: meldingerFeil,
    } = useMeldinger()
    const melding = meldinger?.find((m) => m.uuid === id)

    if (!router.isReady || meldingerLaster) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }

    if (meldingerFeilet) {
        return <BeskjedFeil status={meldingerFeil instanceof FetchError ? meldingerFeil.status : undefined} />
    }

    if (melding) {
        if (melding.meldingType === 'FORELAGT_INNTEKT_FRA_AAREG') {
            return <ForelagtInntektFraAordningen melding={melding} />
        }
        const task = skapMeldinger([melding])[0]
        return <EnkeltOppgaveAlert oppgave={task} pushLukket={() => {}} />
    }
    return <BeskjedFeil status={404} />
}

function BeskjedFeil({ status }: { status?: number }) {
    const visReload = status !== 403 && status !== 404
    const overskrift =
        status === 403
            ? 'Du har ikke tilgang til beskjeden'
            : status === 404
              ? 'Fant ikke beskjeden'
              : 'Vi klarte ikke å hente beskjeden'

    return (
        <div aria-live="polite">
            <InfoCard data-color="danger" className="mt-4">
                <InfoCard.Header icon={<XMarkOctagonIcon aria-hidden fontSize="1.5rem" />}>
                    <Heading level="1" size="small">
                        {overskrift}
                    </Heading>
                </InfoCard.Header>
                <InfoCard.Content>
                    <Button
                        className="bg-ax-bg-default"
                        variant="secondary"
                        type="button"
                        size="small"
                        onClick={() => {
                            if (visReload) {
                                window.location.reload()
                            } else {
                                window.location.href = basePath()
                            }
                        }}
                    >
                        {visReload ? 'Last inn siden på nytt' : 'Gå tilbake til Ditt sykefravær'}
                    </Button>
                </InfoCard.Content>
            </InfoCard>
        </div>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Beskjed
