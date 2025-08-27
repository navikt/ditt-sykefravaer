import { ParsedUrlQuery } from 'querystring'

import React, { ReactElement } from 'react'
import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import Header from '../../components/Header/Header'
import SykmeldingerListAll from '../../components/SykmeldingerList/SykmeldingerListAll'
import TilHovedsiden from '../../components/TilHovedsiden/TilHovedsiden'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../../hooks/useBreadcrumbs'
import { beskyttetSideUtenProps, ServerSidePropsResult } from '../../auth/beskyttetSide'
import { checkToggleAndReportMetrics, getFlagsClientServerSide } from '../../toggles/ssr'
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

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ServerSidePropsResult>> => {
    const flags = await getFlagsClientServerSide(context)
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
        const bliHosFlex = checkToggleAndReportMetrics(flags, 'ditt-sykefravaer-sykmelding-gradvis-utrulling')

        if (bliHosFlex) {
            return beskyttetSideUtenProps(context)
        } else {
            return {
                redirect: {
                    destination: tsmSykmeldingUrl(),
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
