import { Alert, Button, Heading, Loader } from '@navikt/ds-react'
import React from 'react'
import { useIsFetching, UseQueryResult } from 'react-query'

import useArbeidsrettetOppfolging from '../../hooks/useArbeidsrettetOppfolging'
import useDialogmoteBehov from '../../hooks/useDialogmoteBehov'
import useNarmesteledere from '../../hooks/useNarmesteledere'
import useOppfolgingsplaner from '../../hooks/useOppfolgingsplaner'
import useSoknader from '../../hooks/useSoknader'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import useVedtak from '../../hooks/useVedtak'
import Vis from '../Vis'

interface QueryOgFeilmelding {
    query: UseQueryResult
    message: string
}

const QueryStatusPanel = () => {
    const isFetching = useIsFetching()

    const sykmeldinger: QueryOgFeilmelding = {
        query: useSykmeldinger(),
        message: 'Kunne ikke hente dine sykmeldinger',
    }
    const soknader: QueryOgFeilmelding = {
        query: useSoknader(),
        message: 'Kunne ikke hente dine søknader',
    }
    const vedtak: QueryOgFeilmelding = {
        query: useVedtak(),
        message: 'Kunne ikke hente dine vedtak',
    }
    const oppfolgingsplaner: QueryOgFeilmelding = {
        query: useOppfolgingsplaner(),
        message: 'Kunne ikke hente oppfølgingsplaner',
    }
    const dialogmoteBehov: QueryOgFeilmelding = {
        query: useDialogmoteBehov(),
        message: 'Kunne ikke sjekke behov for dialogmøte',
    }
    const narmesteledere: QueryOgFeilmelding = {
        query: useNarmesteledere(),
        message: 'Kunne ikke hente din nærmeste leder',
    }
    const arbeidsrettetOppfolging: QueryOgFeilmelding = {
        query: useArbeidsrettetOppfolging(),
        message: 'Kunne ikke hente arbeidsrettet oppfølging',
    }

    const errorQueries = [
        sykmeldinger,
        soknader,
        vedtak,
        oppfolgingsplaner,
        dialogmoteBehov,
        narmesteledere,
        arbeidsrettetOppfolging,
    ].filter((a) => a.query.isError)

    return (
        <>
            <Vis
                hvis={isFetching > 0}
                render={() => (
                    <div className="mb-4  text-center">
                        <Heading level="2" size="small" className="m-2">
                            Henter ditt sykefravær
                        </Heading>
                        <Loader />
                    </div>
                )}
            />
            <Vis
                hvis={errorQueries.length > 0}
                render={() => (
                    <Alert variant="warning" className="mb-4">
                        <strong>Ai ai ai!</strong>
                        <span> Vi har problemer med noen av baksystemene nå. </span>
                        <ul>
                            {errorQueries.map((e, idx) => (
                                <li key={idx}>{e.message}</li>
                            ))}
                        </ul>

                        <Button
                            onClick={() => {
                                errorQueries.forEach((a) => a.query.refetch())
                            }}
                            className={'mt-4'}
                        >
                            Hent på nytt
                        </Button>
                    </Alert>
                )}
            />
        </>
    )
}

export default QueryStatusPanel
