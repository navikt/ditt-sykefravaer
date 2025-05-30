import Head from 'next/head'
import React, { Fragment, PropsWithChildren, ReactElement } from 'react'
import { Alert, BodyShort, GuidePanel, Heading, Link as DsLink, Skeleton } from '@navikt/ds-react'
import { logger } from '@navikt/next-logger'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { range } from 'remeda'

import { RegelStatus, StatusEvent, Sykmelding } from '../../../types/sykmelding'
import StatusBanner from '../../../components/StatusBanner/StatusBanner'
import StatusInfo from '../../../components/StatusInfo/StatusInfo'
import useGetSykmeldingIdParam from '../../../hooks/useGetSykmeldingIdParam'
import Header from '../../../components/Header/Header'
import PageWrapper from '../../../components/PageWrapper/PageWrapper'
import { getReadableSykmeldingLength, getSentSykmeldingTitle } from '../../../utils/sykmeldingUtils'
import HintToNextOlderSykmelding from '../../../components/ForceOrder/HintToNextOlderSykmelding'
import SykmeldingArbeidsgiverExpansionCard from '../../../components/Sykmelding/SykmeldingerArbeidsgiver/SykmeldingArbeidsgiverExpansionCard'
import SykmeldingSykmeldtSection from '../../../components/Sykmelding/SykmeldingerSykmeldt/SykmeldingSykmeldtSection'
import { createKvitteringBreadcrumbs, useUpdateBreadcrumbs } from '../../../hooks/useBreadcrumbs'
import TilHovedsiden from '../../../components/TilHovedsiden/TilHovedsiden'
import { beskyttetSideUtenProps } from '../../../auth/beskyttetSide'
import { Flexjar } from '../../../components/flexjar/flexjar'
import { useToggle } from '../../../toggles/context'
import useSykmeldingByIdRest from '../../../hooks/useSykmeldingByIdRest'

function SykmeldingkvitteringPage(): ReactElement {
    const sykmeldingId = useGetSykmeldingIdParam()
    const { data, error, isPending } = useSykmeldingByIdRest(sykmeldingId)
    const router = useRouter()
    const flexjarToggle = useToggle('flexjar-sykmelding-kvittering')

    if (isPending) {
        return (
            <KvitteringWrapper>
                <KvitteringSkeletonTop>
                    <KvitteringSkeletonBottom />
                </KvitteringSkeletonTop>
            </KvitteringWrapper>
        )
    }

    if (error) {
        return (
            <KvitteringWrapper>
                <Alert variant="error" role="alert" aria-live="polite">
                    Sykmeldingen kunne ikke hentes. Prøv igjen senere.
                </Alert>
            </KvitteringWrapper>
        )
    }

    if (data == null) {
        logger.error(`Sykmelding with id ${sykmeldingId} is undefined`)
        return (
            <KvitteringWrapper>
                <Alert variant="error" role="alert" aria-live="polite">
                    En uventet feil oppsto. Vennligst kontakt NAV dersom problemet vedvarer.
                </Alert>
            </KvitteringWrapper>
        )
    }

    if (
        data.behandlingsutfall.status === RegelStatus.INVALID ||
        ![StatusEvent.SENDT, StatusEvent.BEKREFTET].includes(data.sykmeldingStatus.statusEvent)
    ) {
        logger.error(
            `Trying to display kvittering for sykmelding with id: ${sykmeldingId}, but the status is wrong, sykmeldingstatus: ${data.sykmeldingStatus.statusEvent}, behandlingsutfall: ${data.behandlingsutfall.status}`,
        )
        return (
            <KvitteringWrapper sykmelding={data}>
                <GuidePanel poster>
                    <Heading size="medium" level="2" spacing>
                        Klarer ikke å vise kvittering
                    </Heading>
                    <BodyShort spacing>
                        Beklager! En uventet feil har oppstått. Sannsynligvis jobber vi med saken allerede, men ta
                        kontakt med oss hvis det ikke har løst seg til i morgen.
                    </BodyShort>
                    <BodyShort>
                        Du kan prøve å gå tilbake til{' '}
                        <DsLink as={Link} href={`/${sykmeldingId}`}>
                            selve sykmeldingen
                        </DsLink>
                        .
                    </BodyShort>
                </GuidePanel>
            </KvitteringWrapper>
        )
    }

    return (
        <KvitteringWrapper sykmelding={data}>
            <div className="mb-8">
                <StatusBanner
                    sykmeldingStatus={data.sykmeldingStatus}
                    behandlingsutfall={data.behandlingsutfall}
                    isEgenmeldingsKvittering={router.query.egenmelding === 'true'}
                />
            </div>

            <div className="mb-8">
                <StatusInfo
                    sykmeldingStatus={data.sykmeldingStatus}
                    sykmeldingsperioder={data.sykmeldingsperioder}
                    sykmeldingMerknader={data.merknader ?? []}
                />
            </div>

            <div className="mb-8">
                <SykmeldingSykmeldtSection
                    sykmelding={data}
                    shouldShowEgenmeldingsdagerInfo={data.sykmeldingStatus.statusEvent === StatusEvent.SENDT}
                />
            </div>

            {data.sykmeldingStatus.statusEvent === 'SENDT' && <SykmeldingArbeidsgiverExpansionCard sykmelding={data} />}

            <HintToNextOlderSykmelding />
            {flexjarToggle.enabled && <Flexjar feedbackId="sykmelding-kvittering" />}
        </KvitteringWrapper>
    )
}

function KvitteringWrapper({ sykmelding, children }: PropsWithChildren<{ sykmelding?: Sykmelding }>): ReactElement {
    const sykmeldingId = useGetSykmeldingIdParam()
    useUpdateBreadcrumbs(() => createKvitteringBreadcrumbs(sykmeldingId, sykmelding), [sykmeldingId, sykmelding])

    return (
        <>
            <Head>
                <title>Kvittering - www.nav.no</title>
            </Head>
            {sykmelding == null ? (
                <Header skeleton />
            ) : (
                <Header title={getSentSykmeldingTitle(sykmelding)} subTitle={getReadableSykmeldingLength(sykmelding)} />
            )}
            <PageWrapper>
                {children}
                <div className="mt-16">
                    <TilHovedsiden />
                </div>
            </PageWrapper>
        </>
    )
}

function KvitteringSkeletonTop({ children }: PropsWithChildren): ReactElement {
    return (
        <section aria-labelledby="sykmelding-loading-skeleton">
            <Heading id="sykmelding-loading-skeleton" size="medium" level="3" hidden>
                Henter kvitteringen
            </Heading>
            <div className="rounded border border-border-subtle p-4">
                <Skeleton width="50%" />
                <Skeleton width="30%" />
            </div>
            <div className="navds-guide-panel navds-guide-panel--poster mb-8 mt-8">
                <Skeleton
                    className="navds-guide !border-none"
                    variant="circle"
                    width="var(--a-spacing-24)"
                    height="var(--a-spacing-24)"
                />
                <div className="border border-border-subtle p-8 [clip-path:polygon(0%_0%,_0%_100%,_calc(50%_-_3rem)_100%,_calc(50%_-_3rem)_0%,_calc(50%_+_3rem)_0%,_calc(50%_+_3rem)_8px,_calc(50%_-_3rem)_8px,_calc(50%_-_3rem)_100%,_100%_100%,_100%_0%)]">
                    <div className="pt-8">
                        <Skeleton />
                        <Skeleton width="30%" />
                        <Skeleton width="15%" className="mt-4" />
                    </div>
                </div>
            </div>
            <Skeleton variant="rectangle" height="10rem" />
            {children}
        </section>
    )
}

function KvitteringSkeletonBottom(): ReactElement {
    return (
        <>
            <Skeleton width="50%" height="3rem" className="mt-8" />
            <Skeleton width="40%" />
            {range(0, 8).map((index) => (
                <Fragment key={index}>
                    <Skeleton width="35%" height="3rem" className="mt-8" />
                    <Skeleton variant="rounded" width="100%" height="4rem" />
                </Fragment>
            ))}
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default SykmeldingkvitteringPage
