import './app.less'

import ModalWrapper from 'nav-frontend-modal'
import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { DataFetcher } from './data/data-fetcher'
import StoreProvider from './data/stores/store-provider'
import Forside from './pages/forside/forside'

export interface RouteParams {
    id: string;
}

const App = (): any => {

    ModalWrapper.setAppElement('#root')

    return (
        <StoreProvider>
            <DataFetcher>

                <main id="maincontent" className="maincontent" role="main" tabIndex={-1}>
                    <Switch>
                        <Route exact={true} path="/" component={Forside} />
                    </Switch>
                </main>

            </DataFetcher>
        </StoreProvider>
    )
}

export default App
