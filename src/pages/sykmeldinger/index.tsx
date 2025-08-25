import { ParsedUrlQuery } from 'querystring'

import React, { ReactElement } from 'react'
import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { flagsClient } from '@unleash/nextjs'
import { logger } from '@navikt/next-logger'

import Header from '../../components/Header/Header'
import SykmeldingerListAll from '../../components/SykmeldingerList/SykmeldingerListAll'
import TilHovedsiden from '../../components/TilHovedsiden/TilHovedsiden'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { beskyttetSideUtenProps, ServerSidePropsResult } from '../../auth/beskyttetSide'
import { getFlagsServerSide } from '../../toggles/ssr'
import { tsmSykmeldingUrl } from '../../utils/environment'

function SykmeldingerPage(): ReactElement {
    useUpdateBreadcrumbs(() => [])

    return (
        <>
            <Head>
                <title>Sykmeldinger - www.nav.no</title>
            </Head>
            <Header title="Sykmeldinger" />
            <PageWrapper>
                <SykmeldingerListAll />
                <div className="mt-16">
                    <TilHovedsiden />
                </div>
            </PageWrapper>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ServerSidePropsResult>> => {
    const { toggles } = await getFlagsServerSide(context)
    const flags = flagsClient(toggles)
    const forceSpecificApp = checkForceSpecificAppQueryParam(context.query, 'app')

    if (forceSpecificApp === 'flex') {
        return beskyttetSideUtenProps(context)
    } else if (forceSpecificApp === 'tsm') {
        return {
            redirect: {
                destination: tsmSykmeldingUrl(),
                permanent: false,
            },
        }
    } else {
        const bliHosFlex = flags.isEnabled('ditt-sykefravaer-sykmelding-gradvis-utrulling')
        await flags
            .sendMetrics()
            .then(() => {
                logger.info('Unleash metrics sent successfully')
            })
            .catch((err) => {
                logger.error('Failed to send Unleash metrics', err)
            })

        if (bliHosFlex) {
            return beskyttetSideUtenProps(context)
        } else {
            return {
                redirect: {
                    destination: sykmeldingUrl(),
                    permanent: false,
                },
            }
        }
    }
}

function checkForceSpecificAppQueryParam(query: ParsedUrlQuery, param: string): 'flex' | 'tsm' | undefined {
    const appRawQueryParam = query[param]
    const appQueryParam = Array.isArray(appRawQueryParam) ? appRawQueryParam[0] : appRawQueryParam
    return appQueryParam == 'flex' ? 'flex' : appQueryParam == 'tsm' ? 'tsm' : undefined
}

export default SykmeldingerPage
