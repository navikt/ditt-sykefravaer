import React, { ReactElement } from 'react'
import Head from 'next/head'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types'

import Header from '../../components/Header/Header'
import SykmeldingerListAll from '../../components/SykmeldingerList/SykmeldingerListAll'
import TilHovedsiden from '../../components/TilHovedsiden/TilHovedsiden'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { beskyttetSideUtenProps, ServerSidePropsResult } from '../../auth/beskyttetSide'
import { getFlagsServerSide } from '../../toggles/ssr'

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

export async function getServerSideProps(
    context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ServerSidePropsResult>> {
    // Get flags first to check gradual rollout toggle
    const flags = await getFlagsServerSide(context.req, context.res)

    const gradualRolloutToggle = flags.toggles.find(
        (toggle) => toggle.name === 'ditt-sykefravaer-sykmelding-gradual-rollout',
    )

    if (!gradualRolloutToggle?.enabled) {
        // TODO: Replace with the actual URL of the old sykmelding app
        const oldAppUrl = process.env.OLD_SYKMELDING_APP_URL || 'https://old-sykmelding-app.nav.no/sykmelding'

        return {
            redirect: {
                destination: oldAppUrl,
                permanent: false,
            },
        }
    }

    // If toggle is enabled, use the standard beskyttetSideUtenProps flow
    return beskyttetSideUtenProps(context)
}

export default SykmeldingerPage
