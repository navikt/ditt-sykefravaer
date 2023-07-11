/* eslint-disable postcss-modules/no-unused-class */
import '../style/global.css'

import { configureLogger } from '@navikt/next-logger'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import type { AppProps as NextAppProps } from 'next/app'
import Head from 'next/head'
import React, { PropsWithChildren } from 'react'
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from 'react-query'

import { useHandleDecoratorClicks } from '../hooks/useBreadcrumbs'
import { basePath, isMockBackend } from '../utils/environment'
import { LabsWarning } from '../components/labs-warning/LabsWarning'
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from '../faro/faro'

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

initInstrumentation()
configureLogger({
    basePath: basePath(),
    onLog: (log) =>
        getFaro()?.api.pushLog(log.messages, {
            level: pinoLevelToFaroLevel(log.level.label),
        }),
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Setting this to true causes query request after initial
            // mount even if the query was hydrated from the server side.
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    },
})

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    useHandleDecoratorClicks()

    return (
        <>
            <Head>
                <title>Ditt sykefravær</title>
                <meta name="robots" content="noindex" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    <div id="root" className="mx-auto max-w-2xl p-4 pb-32">
                        <LabsWarning />
                        <Component {...pageProps} />
                    </div>
                </Hydrate>
            </QueryClientProvider>
        </>
    )
}

export default MyApp
