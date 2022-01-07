import './app.less'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Route, Switch } from 'react-router-dom'

import AktivitetskravVarsel from './pages/aktivitetskrav/AktivitetskravVarsel'
import Forside from './pages/forside/Forside'
import { RedirectSykepengesoknadUtland, RedirectSykmeldinger } from './pages/redirect/Redirect'
import SnartSlutt from './pages/snart-slutt/SnartSlutt'
import Tidslinjen from './pages/tidslinjen/Tidslinjen'

export interface RouteParams {
    id: string;
}

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                refetchOnWindowFocus: false,
                staleTime: Infinity,
            },
        },
    })
    return (
        <QueryClientProvider client={queryClient}>
            <main id="maincontent" className="maincontent" role="main" tabIndex={-1}>
                <Switch>
                    <Route exact={true} path="/" component={Forside} />
                    <Route path="/aktivitetsplikt" component={AktivitetskravVarsel} />
                    <Route path="/snart-slutt-pa-sykepengene" component={SnartSlutt} />
                    <Route path="/tidslinjen" component={Tidslinjen} />
                    <Route path="/sykepengesoknad-utland" component={RedirectSykepengesoknadUtland} />
                    <Route path="/sykmeldinger" component={RedirectSykmeldinger} />
                    <Route path="*" component={Forside} />
                </Switch>
            </main>
        </QueryClientProvider>
    )
}

export default App
