import './QueryStatusPanel.less'

import Alertstripe from 'nav-frontend-alertstriper'
import { Knapp } from 'nav-frontend-knapper'
import NavFrontendSpinner from 'nav-frontend-spinner'
import { Undertittel } from 'nav-frontend-typografi'
import React from 'react'
import { useIsFetching, UseQueryResult } from 'react-query'

import use39ukersvarsel from '../../query-hooks/use39ukersvarsel'
import useArbeidsrettetOppfolging from '../../query-hooks/useArbeidsrettetOppfolging'
import useDialogmoteBehov from '../../query-hooks/useDialogmoteBehov'
import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useOppfolgingsplaner from '../../query-hooks/useOppfolgingsplaner'
import useSoknader from '../../query-hooks/useSoknader'
import useSykeforloep from '../../query-hooks/useSykeforloep'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import useVedtak from '../../query-hooks/useVedtak'
import Vis from '../Vis'

interface QueryOgFeilmelding {
    query: UseQueryResult;
    message: string;
}

const QueryStatusPanel = () => {
    const isFetching = useIsFetching()

    const sykmeldinger: QueryOgFeilmelding = {
        query: useSykmeldinger(),
        message: 'Kunne ikke hente dine sykmeldinger'
    }
    const soknader: QueryOgFeilmelding = {
        query: useSoknader(),
        message: 'Kunne ikke hente dine søknader'
    }
    const vedtak: QueryOgFeilmelding = {
        query: useVedtak(),
        message: 'Kunne ikke hente dine vedtak'
    }
    const oppfolgingsplaner: QueryOgFeilmelding = {
        query: useOppfolgingsplaner(),
        message: 'Kunne ikke hente oppfølgingsplaner'
    }
    const dialogmoteBehov: QueryOgFeilmelding = {
        query: useDialogmoteBehov(),
        message: 'Kunne ikke sjekke behov for dialogmøte'
    }
    const narmesteledere: QueryOgFeilmelding = {
        query: useNarmesteledere(),
        message: 'Kunne ikke hente din nærmeste leder'
    }
    const trettiniUkersvarsel: QueryOgFeilmelding = {
        query: use39ukersvarsel(),
        message: 'Kunne ikke hente lengde på sykeforløp'
    }
    const arbeidsrettetOppfolging: QueryOgFeilmelding = {
        query: useArbeidsrettetOppfolging(),
        message: 'Kunne ikke hente arbeidsrettet oppfølging'
    }
    const sykeforloep: QueryOgFeilmelding = {
        query: useSykeforloep(),
        message: 'Kunne ikke hente ditt siste sykeforløp'
    }

    const errorQueries = [
        sykmeldinger,
        soknader,
        vedtak,
        oppfolgingsplaner,
        dialogmoteBehov,
        narmesteledere,
        trettiniUkersvarsel,
        arbeidsrettetOppfolging,
        sykeforloep,
    ].filter((a) =>
        a.query.isError
    )

    return (
        <>
            <Vis hvis={isFetching > 0}
                render={() =>
                    <div className="query-status-panel">
                        <Undertittel>Henter ditt sykefravær</Undertittel>
                        <NavFrontendSpinner />
                    </div>
                }
            />
            <Vis hvis={errorQueries.length > 0}
                render={() =>
                    <Alertstripe type="advarsel" className="query-status-error" >
                        <strong>Ai ai ai!</strong>
                        <span> Vi har problemer med noen av baksystemene nå. </span>
                        <ul>
                            {errorQueries.map((e, idx) =>
                                <li key={idx}>
                                    {e.message}
                                </li>
                            )}
                        </ul>

                        <Knapp onClick={() => {
                            errorQueries.forEach((a) => a.query.refetch())
                        }}
                        >
                            Hent på nytt
                        </Knapp>
                    </Alertstripe>
                }
            />
        </>
    )
}

export default QueryStatusPanel
