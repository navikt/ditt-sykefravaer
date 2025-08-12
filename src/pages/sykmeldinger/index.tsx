import React, { ReactElement } from 'react'
import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import Header from '../../components/Header/Header'
import SykmeldingerListAll from '../../components/SykmeldingerList/SykmeldingerListAll'
import TilHovedsiden from '../../components/TilHovedsiden/TilHovedsiden'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useUpdateBreadcrumbs } from '../../hooks/useBreadcrumbs'
import { beskyttetSideUtenProps, ServerSidePropsResult } from '../../auth/beskyttetSide'
import { getFlagsServerSide } from '../../toggles/ssr'
import { sykmeldingUrl } from '../../utils/environment'

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
    const gradualRolloutToggle = flags.toggles.find(
        (toggle) => toggle.name === 'ditt-sykefravaer-sykmelding-gradvis-utrulling',
    )

    if (gradualRolloutToggle?.enabled) {
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

export default SykmeldingerPage
