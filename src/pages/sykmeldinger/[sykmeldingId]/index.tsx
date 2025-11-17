import { Fragment, PropsWithChildren, ReactElement, useCallback, useEffect, useState } from 'react'
import { Alert, BodyLong, BodyShort, GuidePanel, Heading, Link, Skeleton } from '@navikt/ds-react'
import Head from 'next/head'
import { logger } from '@navikt/next-logger'
import { range } from 'remeda'

import { getReadableSykmeldingLength, getSentSykmeldingTitle, getSykmeldingTitle } from '../../../utils/sykmeldingUtils'
import OkBekreftetSykmelding from '../../../components/SykmeldingViews/OK/BEKREFTET/OkBekreftetSykmelding'
import OkAvbruttSykmelding from '../../../components/SykmeldingViews/OK/AVBRUTT/OkAvbruttSykmelding'
import OkSendtSykmelding from '../../../components/SykmeldingViews/OK/SENDT/OkSendtSykmelding'
import OkUtgattSykmelding from '../../../components/SykmeldingViews/OK/UTGATT/OkUtgattSykmelding'
import OkApenSykmelding from '../../../components/SykmeldingViews/OK/APEN/OkApenSykmelding'
import InvalidApenSykmelding from '../../../components/SykmeldingViews/INVALID/APEN/InvalidApenSykmelding'
import InvalidBekreftetSykmelding from '../../../components/SykmeldingViews/INVALID/BEKREFTET/InvalidBekreftetSykmelding'
import useGetSykmeldingIdParam from '../../../hooks/useGetSykmeldingIdParam'
import Header from '../../../components/Header/Header'
import TilHovedsiden from '../../../components/TilHovedsiden/TilHovedsiden'
import PageWrapper from '../../../components/PageWrapper/PageWrapper'
import { breadcrumbBuilders, useUpdateBreadcrumbs } from '../../../hooks/useBreadcrumbs'
import useFocusRefetch from '../../../hooks/useFocusRefetch'
import { isUtenlandsk } from '../../../utils/utenlanskUtils'
import { getUserRequestId } from '../../../utils/userRequestId'
import { findOlderSykmeldingId } from '../../../utils/findOlderSykmeldingId'
import { useLogUmamiEvent } from '../../../components/umami/umami'
import { beskyttetSideUtenProps } from '../../../auth/beskyttetSide'
import { basePath } from '../../../utils/environment'
import useSykmelding from '../../../hooks/sykmelding/useSykmelding'
import { Sykmelding, StatusEvent } from '../../../types/sykmelding/sykmelding'
import useSykmeldinger from '../../../hooks/sykmelding/useSykmeldinger'

function SykmeldingPage(): ReactElement {
    const sykmeldingId = useGetSykmeldingIdParam()

    const { data, error, isLoading: loading, refetch } = useSykmelding(sykmeldingId)
    const {
        data: alleSykmeldinger,
        error: alleSykmeldingerError,
        isPending: isAlleSykmeldingerLoading,
    } = useSykmeldinger()
    const olderSykmelding = alleSykmeldinger != null ? findOlderSykmeldingId(data, alleSykmeldinger) : null
    const isOlderSykmeldingLoading = isAlleSykmeldingerLoading
    const olderSykmeldingError = alleSykmeldingerError

    useFocusRefetch(refetch)

    useUpdateBreadcrumbs(() => breadcrumbBuilders.sykmelding(data))

    if (data == null && (loading || isOlderSykmeldingLoading)) {
        return (
            <SykmeldingerWrapper>
                <SykmeldingSkeleton />
            </SykmeldingerWrapper>
        )
    }

    if (olderSykmeldingError || (error && data == null)) {
        return (
            <SykmeldingerWrapper>
                <Alert variant="error" role="alert" aria-live="polite">
                    <Heading level="1" size="medium" spacing>
                        Det har oppstått en feil
                    </Heading>
                    <BodyShort spacing>
                        Du kan prøve å <Link href="">oppfriske</Link> siden for å se om det løser problemet.
                    </BodyShort>
                    <BodyShort spacing>
                        Dersom problemet vedvarer, kan du fortelle oss om feilen på
                        <Link
                            className="text-red-500"
                            href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler"
                        >
                            skjemaet for feil og mangler
                        </Link>
                        .
                    </BodyShort>
                    <BodyShort>
                        Tar du kontakt så kan du gi oss denne tekniske sporingskoden for å hjelpe oss å løse problemet:{' '}
                        <code className="border border-border-subtle p-0.5 text-sm">
                            {getUserRequestId().split('-')[0]}
                        </code>
                    </BodyShort>
                </Alert>
            </SykmeldingerWrapper>
        )
    }

    if (data === undefined) {
        logger.error(`Sykmelding with id ${sykmeldingId} is undefined`)
        return (
            <SykmeldingerWrapper>
                <Alert variant="error" role="alert" aria-live="polite">
                    En uventet feil oppsto. Vennligst kontakt NAV dersom problemet vedvarer.
                </Alert>
            </SykmeldingerWrapper>
        )
    }

    return (
        <SykmeldingerWrapper sykmelding={data}>
            <SykmeldingComponent
                sykmelding={data}
                olderSykmeldingId={olderSykmelding?.earliestSykmeldingId ?? null}
                olderSykmeldingCount={olderSykmelding?.olderSykmeldingCount ?? 0}
            />
        </SykmeldingerWrapper>
    )
}

function SykmeldingComponent({
    sykmelding,
    olderSykmeldingId,
    olderSykmeldingCount,
}: {
    sykmelding: Sykmelding
    olderSykmeldingId: string | null
    olderSykmeldingCount: number
}): ReactElement | null {
    useLogSykmeldingPageUmami(sykmelding, olderSykmeldingCount)

    const [hasReopenedSykmelding, setHasReopenedSykmelding] = useState(false)
    const reopen = useCallback(() => {
        setHasReopenedSykmelding(true)
    }, [])
    const closeReopen = useCallback(() => {
        setHasReopenedSykmelding(false)
    }, [])

    const behandlingsutfall = sykmelding.behandlingsutfall.status
    const status = sykmelding.sykmeldingStatus.statusEvent

    switch (behandlingsutfall) {
        case 'OK':
            if (hasReopenedSykmelding) {
                return (
                    <OkApenSykmelding
                        sykmelding={sykmelding}
                        olderSykmeldingId={olderSykmeldingId}
                        olderSykmeldingCount={olderSykmeldingCount}
                        onSykmeldingAvbrutt={closeReopen}
                    />
                )
            }

            switch (status) {
                case 'APEN':
                    return (
                        <OkApenSykmelding
                            sykmelding={sykmelding}
                            olderSykmeldingId={olderSykmeldingId}
                            olderSykmeldingCount={olderSykmeldingCount}
                            onSykmeldingAvbrutt={() => void 0}
                        />
                    )
                case 'BEKREFTET':
                    return <OkBekreftetSykmelding sykmelding={sykmelding} reopen={reopen} />
                case 'SENDT':
                    return <OkSendtSykmelding sykmelding={sykmelding} />
                case 'AVBRUTT':
                    return <OkAvbruttSykmelding sykmelding={sykmelding} reopen={reopen} />
                case 'UTGATT':
                    return <OkUtgattSykmelding sykmelding={sykmelding} />
                default:
                    logger.error(`${behandlingsutfall} sykmelding with unsupported status: ${status}`)
                    return <GuidePanel>Oisann! Det har oppstått en feil i baksystemene.</GuidePanel>
            }
        case 'INVALID':
            if (hasReopenedSykmelding) {
                return <InvalidApenSykmelding sykmelding={sykmelding} />
            }

            switch (status) {
                case 'APEN':
                    return <InvalidApenSykmelding sykmelding={sykmelding} />
                case 'BEKREFTET':
                    return <InvalidBekreftetSykmelding sykmelding={sykmelding} />
                default:
                    logger.error(`Avvist sykmelding with unsupported status: ${status}`)
                    return <GuidePanel>Oisann! Det har oppstått en feil i baksystemene.</GuidePanel>
            }
    }

    return null
}

function useLogSykmeldingPageUmami(sykmelding: Sykmelding, olderSykmeldingCount: number): void {
    useLogUmamiEvent(
        { eventName: 'komponent vist', data: { komponent: 'Sykmelding Page' } },
        {
            status: sykmelding.sykmeldingStatus.statusEvent,
            behandlingsutfall: sykmelding.behandlingsutfall.status,
            hasOlderSykmelding: olderSykmeldingCount > 0,
            isUtenlandsk: isUtenlandsk(sykmelding),
        },
    )
}

function SykmeldingerWrapper({ sykmelding, children }: PropsWithChildren<{ sykmelding?: Sykmelding }>): ReactElement {
    useEffect(() => {
        const listener = (e: KeyboardEvent): void => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p' && sykmelding?.id) {
                e.preventDefault()
                e.stopImmediatePropagation()
                window.open(`${basePath()}/${sykmelding.id}/pdf`, '_ blank')
            }
        }
        addEventListener('keydown', listener)

        return () => removeEventListener('keydown', listener)
    }, [sykmelding?.id])

    return (
        <div className="print:h-full print:overflow-hidden">
            <div className="hidden print:m-24 print:mb-0 print:block" hidden>
                <Heading level="1" size="large" spacing>
                    Det er ikke mulig å printe på denne måten.
                </Heading>
                <BodyLong>Vennligst bruk printknappen øverst til høyre for sykmeldingen for å printe.</BodyLong>
            </div>
            <div className="print:hidden">
                <Head>
                    <title>Sykmelding - www.nav.no</title>
                </Head>
                {sykmelding == null ? (
                    <Header skeleton />
                ) : (
                    <Header
                        title={
                            sykmelding.sykmeldingStatus.statusEvent === StatusEvent.SENDT ||
                            sykmelding.sykmeldingStatus.statusEvent === StatusEvent.BEKREFTET
                                ? getSentSykmeldingTitle(sykmelding)
                                : getSykmeldingTitle(sykmelding)
                        }
                        subTitle={getReadableSykmeldingLength(sykmelding)}
                    />
                )}
                <PageWrapper>
                    {children}
                    <div className="mt-16">
                        <TilHovedsiden />
                    </div>
                </PageWrapper>
            </div>
        </div>
    )
}

function SykmeldingSkeleton(): ReactElement {
    return (
        <section aria-labelledby="sykmelding-loading-skeleton">
            <Heading id="sykmelding-loading-skeleton" size="medium" level="3" hidden>
                Henter sykmeldingen
            </Heading>
            <div className="sm:px-8">
                <div className="flex w-full items-end gap-4 sm:pr-8">
                    <Skeleton variant="circle" width="var(--a-spacing-12)" height="var(--a-spacing-12)" className="" />
                    <div className="grow rounded-xl border border-border-subtle p-4">
                        <Skeleton width="50%" className="mb-2" />
                        <Skeleton width="100%" />
                        <Skeleton width="69%" />
                        <Skeleton width="80%" className="mt-2" />
                    </div>
                </div>
            </div>
            <Skeleton width="50%" height="3rem" className="mt-8" />
            <Skeleton width="40%" />
            {range(0, 8).map((index) => (
                <Fragment key={index}>
                    <Skeleton width="35%" height="3rem" className="mt-8" />
                    <Skeleton variant="rounded" width="100%" height="4rem" />
                </Fragment>
            ))}
        </section>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default SykmeldingPage
