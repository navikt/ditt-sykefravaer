import { Alert, Button } from '@navikt/ds-react'
import React from 'react'
import { UseQueryResult } from '@tanstack/react-query'

import useArbeidsrettetOppfolging from '../../hooks/useArbeidsrettetOppfolging'
import useNarmesteledere from '../../hooks/useNarmesteledere'
import useOppfolgingsplaner from '../../hooks/useOppfolgingsplaner'
import useSoknader from '../../hooks/useSoknader'
import useTsmSykmeldinger from '../../hooks/useTsmSykmeldinger'
import useVedtak from '../../hooks/useVedtak'
import { useInntektsmeldinger } from '../../hooks/useInntektsmeldinger'

interface QueryOgFeilmelding {
    query: UseQueryResult
    message: string
}

const QueryStatusPanel = () => {
    const sykmeldinger: QueryOgFeilmelding = {
        query: useTsmSykmeldinger(),
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
    const narmesteledere: QueryOgFeilmelding = {
        query: useNarmesteledere(),
        message: 'Kunne ikke hente din nærmeste leder',
    }
    const arbeidsrettetOppfolging: QueryOgFeilmelding = {
        query: useArbeidsrettetOppfolging(),
        message: 'Kunne ikke hente arbeidsrettet oppfølging',
    }
    const inntektsmeldinger: QueryOgFeilmelding = {
        query: useInntektsmeldinger(),
        message: 'Kunne ikke hente inntektsmeldinger',
    }

    const errorQueries = [
        sykmeldinger,
        soknader,
        vedtak,
        oppfolgingsplaner,
        narmesteledere,
        arbeidsrettetOppfolging,
        inntektsmeldinger,
    ].filter((a) => a.query.isError)

    return (
        <>
            {errorQueries.length > 0 && (
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
                        className="mt-4"
                    >
                        Hent på nytt
                    </Button>
                </Alert>
            )}
        </>
    )
}

export default QueryStatusPanel
