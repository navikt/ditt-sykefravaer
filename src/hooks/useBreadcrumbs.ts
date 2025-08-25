import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import { Sykmelding } from '../types/sykmelding'
import { minSideUrl } from '../utils/environment'
import { getSykmeldingTitle } from '../utils/sykmeldingUtils'

export function useUpdateBreadcrumbs(buildBreadcrumbs: BreadcrumbBuilder): void {
    useEffect(() => {
        const updateBreadcrumbs = async () => {
            try {
                const breadcrumbs = buildBreadcrumbs()
                const completeBreadcrumbs = createCompleteBreadcrumbs(breadcrumbs)
                console.log('Setting breadcrumbs:', completeBreadcrumbs)
                await setBreadcrumbs(completeBreadcrumbs)
            } catch (error) {
                logger.error(error, `Failed to update breadcrumbs on ${location.pathname}`)
            }
        }

        updateBreadcrumbs().catch((error) => {
            logger.error(error, `Unexpected error in breadcrumb update on ${location.pathname}`)
        })
    }, [buildBreadcrumbs])
}

export const breadcrumbBuilders = {
    dittSykefravaer: (): CompleteBreadcrumb[] => [BREADCRUMB_ITEMS.DITT_SYKEFRAVAER],

    inntektsmeldinger: (): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        BREADCRUMB_ITEMS.INNTEKTSMELDINGER,
    ],

    inntektsmelding: (organisasjonsnavn: string, inntektsmeldingId: string): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        BREADCRUMB_ITEMS.INNTEKTSMELDINGER,
        createBreadcrumbItem(organisasjonsnavn || '...', `/inntektsmeldinger/${inntektsmeldingId}`),
    ],

    manglendeInntektsmelding: (): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        createBreadcrumbItem('Manglende inntektsmelding'),
    ],

    forelagtInntekt: (): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        createBreadcrumbItem('Din inntektsmelding fra Aareg'),
    ],

    opplysningerFraAordningen: (): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        createBreadcrumbItem('Opplysninger fra a-ordningen'),
    ],

    sykmeldinger: (): CompleteBreadcrumb[] => [BREADCRUMB_ITEMS.DITT_SYKEFRAVAER, BREADCRUMB_ITEMS.SYKMELDINGER],

    sykmelding: (sykmelding: Sykmelding | undefined): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        BREADCRUMB_ITEMS.SYKMELDINGER,
        createBreadcrumbItem(getSykmeldingTitle(sykmelding)),
    ],

    sykmeldingKvittering: (sykmeldingId: string, sykmelding: Sykmelding | undefined): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        BREADCRUMB_ITEMS.SYKMELDINGER,
        createBreadcrumbItem(getSykmeldingTitle(sykmelding), `/${sykmeldingId}`, true),
        createBreadcrumbItem('Kvittering'),
    ],

    notFound: (): CompleteBreadcrumb[] => [createBreadcrumbItem('Ukjent side', '/404')],

    serverError: (): CompleteBreadcrumb[] => [createBreadcrumbItem('Ukjent feil', '/500')],
} as const

export function useHandleDecoratorClicks(): void {
    const router = useRouter()

    const handleBreadcrumbClick = useCallback(
        (breadcrumb: BreadcrumbItem) => {
            try {
                router.push(breadcrumb.url)
            } catch (error) {
                logger.error(error, `Failed to navigate to breadcrumb URL: ${breadcrumb.url}`)
            }
        },
        [router],
    )

    useEffect(() => {
        onBreadcrumbClick(handleBreadcrumbClick)
    }, [handleBreadcrumbClick])
}

export function createInitialServerSideBreadcrumbs(pathname: SsrPathVariants | string): CompleteBreadcrumb[] {
    switch (pathname) {
        case SsrPathVariants.NotFound:
        case SsrPathVariants.ServerError:
        case SsrPathVariants.DittSykefravaer:
            return createCompleteBreadcrumbs([])
        case SsrPathVariants.Inntektsmeldinger:
            return createCompleteBreadcrumbs(breadcrumbBuilders.inntektsmeldinger())
        case SsrPathVariants.ManglendeInntektsmelding:
            return createCompleteBreadcrumbs(breadcrumbBuilders.manglendeInntektsmelding())
        case SsrPathVariants.Beskjed:
            return createCompleteBreadcrumbs(breadcrumbBuilders.forelagtInntekt())
        default:
            logger.info(`Unknown initial path (${pathname}), defaulting to base breadcrumb`)
            return createCompleteBreadcrumbs([])
    }
}

type BreadcrumbItem = {
    title: string
    url: string
    handleInApp?: boolean
}

type CompleteBreadcrumb = Parameters<typeof setBreadcrumbs>[0][0]

type BreadcrumbBuilder = () => CompleteBreadcrumb[]

const BREADCRUMB_ITEMS = {
    MIN_SIDE: {
        title: 'Min side',
        url: minSideUrl(),
        handleInApp: true,
    } as CompleteBreadcrumb,
    DITT_SYKEFRAVAER: {
        title: 'Ditt sykefravær',
        url: '/',
        handleInApp: true,
    } as CompleteBreadcrumb,
    SYKMELDINGER: {
        title: 'Sykmeldinger',
        url: '/sykmeldinger',
        handleInApp: true,
    } as CompleteBreadcrumb,
    INNTEKTSMELDINGER: {
        title: 'Inntektsmeldinger',
        url: '/inntektsmeldinger',
        handleInApp: true,
    } as CompleteBreadcrumb,
} as const

enum SsrPathVariants {
    NotFound = '/404',
    ServerError = '/500',
    DittSykefravaer = '/',
    ManglendeInntektsmelding = '/inntektsmelding',
    Inntektsmeldinger = '/inntektsmeldinger',
    Beskjed = '/beskjed/[id]',
}

function createCompleteBreadcrumbs(breadcrumbs: CompleteBreadcrumb[]): CompleteBreadcrumb[] {
    return [BREADCRUMB_ITEMS.MIN_SIDE, ...breadcrumbs]
}

function createBreadcrumbItem(title: string, url?: string, handleInApp = true): CompleteBreadcrumb {
    return {
        title,
        url: url || '/',
        handleInApp,
    }
}
