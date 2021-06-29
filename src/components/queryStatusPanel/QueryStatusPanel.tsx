import './QueryStatusPanel.less'

import NavFrontendSpinner from 'nav-frontend-spinner'
import { Undertittel } from 'nav-frontend-typografi'
import React from 'react'
import { useIsFetching } from 'react-query'

import Vis from '../Vis'

const QueryStatusPanel = () => {
    const isFetching = useIsFetching()

    // TODO: Legg inn varsel når ting ikke kan hentes
    return (
        <Vis hvis={isFetching > 0}
            render={() =>
                <div className="query-status-panel">
                    <Undertittel>Henter ditt sykefravær</Undertittel>
                    <NavFrontendSpinner />
                </div>
            }
        />
    )
}

export default QueryStatusPanel
