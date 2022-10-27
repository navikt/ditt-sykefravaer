import '../style/global.css'
import '../components/basic.less'
import '../components/app.less'
import '../components/arbeidssituasjon/arbeidssituasjon.less'
import '../components/banner/banner.less'
import '../components/person/person.less'
import '../components/lenker/lenker.less'
import '../components/oppgaver/oppgaver.less'
import '../components/queryStatusPanel/QueryStatusPanel.less'
import '../components/inntektsmelding/inntektsmelding.less'

import { configureLogger } from '@navikt/next-logger'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import type { AppProps as NextAppProps } from 'next/app'
import Head from 'next/head'
import React, { PropsWithChildren, useState } from 'react'
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from 'react-query'

import { useHandleDecoratorClicks } from '../hooks/useBreadcrumbs'
import { isMockBackend } from '../utils/environment'

interface AppProps extends Omit<NextAppProps, 'pageProps'> {
    pageProps: PropsWithChildren<unknown> & {
        dehydratedState: DehydratedState
    }
}

dayjs.locale({
    ...nb,
    weekStart: 1,
})

if (process.browser && isMockBackend()) {
    require('../data/mock')
}

configureLogger({
    basePath: '/syk/sykefravaer',
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    useHandleDecoratorClicks()

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        /* Setting this to true causes the request to be immediately executed after initial
                           mount Even if the query had data hydrated from the server side render */
                        refetchOnMount: false,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    )

    return (
        <>
            <Head>
                <title>Ditt sykefravær</title>
                <meta name="robots" content="noindex" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <div className="pagewrapper">
                        <div id="root">
                            <Component {...pageProps} />
                        </div>
                    </div>
                </Hydrate>
            </QueryClientProvider>
        </>
    )
}

export default MyApp
