import { ParsedUrlQuery } from 'querystring'

import React, { ReactElement } from 'react'
import Head from 'next/head'
import { GetServerSidePropsResult } from 'next'

import Header from '../../components/Header/Header'
import SykmeldingerListAll from '../../components/SykmeldingerList/SykmeldingerListAll'
import TilHovedsiden from '../../components/TilHovedsiden/TilHovedsiden'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../../hooks/useBreadcrumbs'
import { beskyttetSide, ServerSidePropsResult } from '../../auth/beskyttetSide'
import { checkToggleAndReportMetrics, createFlagsClient, getFlagsServerSide } from '../../toggles/ssr'
import { tsmSykmeldingUrl } from '../../utils/environment'

function SykmeldingerPage(): ReactElement {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.sykmeldinger())

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

export const getServerSideProps = beskyttetSide(
    async (context): Promise<GetServerSidePropsResult<ServerSidePropsResult>> => {
        const flags = await getFlagsServerSide(context)
        const forceSpecificApp = checkForceSpecificAppQueryParam(context.query, 'app')

        const bliHosFlexResultat = { props: { toggles: flags.toggles } }
        const omrutingResultat = { redirect: { destination: tsmSykmeldingUrl(), permanent: false } }

        if (forceSpecificApp === 'flex') {
            return bliHosFlexResultat
        } else if (forceSpecificApp === 'tsm') {
            return omrutingResultat
        } else {
            const flagsClient = createFlagsClient(flags)
            const bliHosFlex = checkToggleAndReportMetrics(flagsClient, 'ditt-sykefravaer-sykmelding-gradvis-utrulling')

            if (bliHosFlex) {
                return bliHosFlexResultat
            } else {
                return omrutingResultat
            }
        }
    },
)

function checkForceSpecificAppQueryParam(query: ParsedUrlQuery, param: string): 'flex' | 'tsm' | undefined {
    const appRawQueryParam = query[param]
    const appQueryParam = Array.isArray(appRawQueryParam) ? appRawQueryParam[0] : appRawQueryParam
    return appQueryParam == 'flex' ? 'flex' : appQueryParam == 'tsm' ? 'tsm' : undefined
}

export default SykmeldingerPage
