import '../style/global.css'

import { configureLogger } from '@navikt/next-logger'
import dayjs from 'dayjs'
import nb from 'dayjs/locale/nb'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { ReactElement, useEffect } from 'react'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'

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
            // Setting this to true causes query request after initial
            // mount even if the query was hydrated from the server side.
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    },
})

type Skyra = {
    redactPathname: (path: string) => void
    redactSearchParam: (param: string) => void
}

function konfigurerSkyra(skyra: Skyra) {
    skyra.redactPathname('/syk/sykefravaer/sykmeldinger/:redacted')
    skyra.redactPathname('/syk/sykefravaer/inntektsmeldinger/:redacted')
}

function MyApp({ Component, pageProps }: AppProps<ServerSidePropsResult>): ReactElement {
    useHandleDecoratorClicks()

    useEffect(() => {
        // @ts-expect-error - skyra er satt opp i dekoratøren
        const skyra = window?.skyra
        if (skyra) {
            konfigurerSkyra(skyra)
        }
    }, [])

    return (
        <>
            <Head>
                <title>Ditt sykefravær</title>
                <meta name="robots" content="noindex" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
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
