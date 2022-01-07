import 'dayjs/locale/nb'

import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import AktivitetskravVarsel from './components/aktivitetskrav/AktivitetskravVarsel'
import Forside from './components/forside/Forside'
import { RedirectSykepengesoknadUtland, RedirectSykmeldinger } from './components/redirect/Redirect'
import SnartSlutt from './components/snart-slutt/SnartSlutt'
import Tidslinjen from './components/tidslinjen/Tidslinjen'
import { isMockBackend } from './utils/environment'

export interface RouteParams {
    id: string;
}

dayjs.locale({
    ...nb,
    weekStart: 1,
})

if (isMockBackend()) {
    require('./data/mock')
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
        <BrowserRouter basename="/syk/sykefravaer">
            <QueryClientProvider client={queryClient}>
                <main id="maincontent" className="maincontent" role="main" tabIndex={-1}>
                    <h2>heei</h2>
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
        </BrowserRouter>
    )
}

export default App
