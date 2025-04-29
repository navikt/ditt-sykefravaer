import '../style/global.css'

import { configureLogger } from '@navikt/next-logger'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import Script from 'next/script'

import { useHandleDecoratorClicks } from '../hooks/useBreadcrumbs'
import { basePath } from '../utils/environment'
import { LabsWarning } from '../components/labs-warning/LabsWarning'
import { getFaro, initInstrumentation, pinoLevelToFaroLevel } from '../faro/faro'
import { FlagProvider } from '../toggles/context'
import { ServerSidePropsResult } from '../auth/beskyttetSide'

dayjs.locale({
    ...nb,
    weekStart: 1,
})

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
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    },
})

function MyApp({ Component, pageProps }: AppProps<ServerSidePropsResult>): ReactElement {
    useHandleDecoratorClicks()

    return (
        <>
            <Head>
                <title>Ditt sykefravær</title>
                <meta name="robots" content="noindex" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Script
                src="https://survey.skyra.no/skyra-survey.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // eslint-disable-next-line no-console 
                    // @ts-expect-error skyra is not defined but will work
                    console.log('Skyra script loaded:', window.skyra)
                    // @ts-expect-error skyra is not defined but will work
                    window.skyra?.start({
                        org: 'arbeids-og-velferdsetaten-nav',
                    })
                }}
            />
            <FlagProvider toggles={pageProps.toggles}>
                <QueryClientProvider client={queryClient}>
                    <div id="root" className="mx-auto max-w-2xl p-4 pb-32">
                        <LabsWarning />
                        <Component {...pageProps} />
                    </div>
                </QueryClientProvider>
            </FlagProvider>
        </>
    )
}

export default MyApp
