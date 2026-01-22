import React, { ReactElement } from 'react'
import Head from 'next/head'

import Header from '../../components/Header/Header'
import SykmeldingerListAll from '../../components/SykmeldingerList/SykmeldingerListAll'
import TilHovedsiden from '../../components/TilHovedsiden/TilHovedsiden'
import PageWrapper from '../../components/PageWrapper/PageWrapper'
import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../../hooks/useBreadcrumbs'
import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'

function SykmeldingerPage(): ReactElement {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.sykmeldinger())

    return (
        <>
            <Head>
                <title>Sykmeldinger</title>
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

export const getServerSideProps = beskyttetSideUtenProps

export default SykmeldingerPage
