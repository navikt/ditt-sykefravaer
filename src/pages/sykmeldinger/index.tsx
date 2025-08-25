import { ParsedUrlQuery } from 'querystring'

import React, { ReactElement } from 'react'
import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { IToggle } from '@unleash/nextjs'

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
    const flags = await getFlagsServerSide(context)
    const gradualRolloutToggle = checkFeatureToggle(flags.toggles, 'ditt-sykefravaer-sykmelding-gradvis-utrulling')
    const forceSpecificApp = checkForceSpecificAppQueryParam(context.query, 'app')

    const stayInApp = forceSpecificApp === undefined ? gradualRolloutToggle : forceSpecificApp === 'flex'

    if (stayInApp) {
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

function checkForceSpecificAppQueryParam(query: ParsedUrlQuery, param: string): 'flex' | 'tsm' | undefined {
    const appRawQueryParam = query[param]
    const appQueryParam = Array.isArray(appRawQueryParam) ? appRawQueryParam[0] : appRawQueryParam
    return appQueryParam == 'flex' ? 'flex' : appQueryParam == 'tsm' ? 'tsm' : undefined
}

function checkFeatureToggle(toggles: IToggle[], name: string): boolean {
    const gradualRolloutToggle = toggles.find((toggle) => toggle.name === name)
    return gradualRolloutToggle?.enabled ?? false
}

export default SykmeldingerPage
