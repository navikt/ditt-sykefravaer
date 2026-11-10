import { Alert, BodyShort, Button, Heading, Link, Skeleton } from '@navikt/ds-react'
import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import useMeldinger from '../../hooks/useMeldinger'
import { ForelagtInntektFraAordningen } from '../../components/opplysningerFraAordningen/hentetFraAordningen'
import { skapMeldinger } from '../../components/oppgaver/meldinger'
import { EnkeltOppgaveAlert } from '../../components/oppgaver/Oppgaver'

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
        isFetching: henterMeldinger,
        refetch: hentMeldinger,
    } = useMeldinger()
    const melding = meldinger?.find((m) => m.uuid === id)

    if (!router.isReady || meldingerLaster) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }

    if (meldingerFeilet) {
        return (
            <Alert variant="error" role="alert">
                <Heading level="1" size="medium" spacing>
                    Vi klarte ikke å hente beskjeden
                </Heading>
                <BodyShort spacing>Det oppsto en teknisk feil. Prøv igjen om litt.</BodyShort>
                <div className="flex flex-col items-start gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        data-color="neutral"
                        loading={henterMeldinger}
                        onClick={() => void hentMeldinger()}
                    >
                        Prøv igjen
                    </Button>
                    <Link as={NextLink} href="/">
                        Gå til Ditt sykefravær
                    </Link>
                </div>
            </Alert>
        )
    }

    if (melding) {
        if (melding.meldingType === 'FORELAGT_INNTEKT_FRA_AAREG') {
            return <ForelagtInntektFraAordningen melding={melding} />
        }
        const task = skapMeldinger([melding])[0]
        return <EnkeltOppgaveAlert oppgave={task} pushLukket={() => {}} />
    }
    return (
        <div>
            <Heading level="1" size="medium" spacing>
                Fant ikke beskjeden
            </Heading>
            <BodyShort spacing>Vi finner ingen beskjed på denne adressen.</BodyShort>
            <Link as={NextLink} href="/">
                Gå til Ditt sykefravær
            </Link>
        </div>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Beskjed
