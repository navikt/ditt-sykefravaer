import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

import { Sykmelding } from '../types/sykmelding/sykmelding'
import { minSideUrl } from '../utils/environment'
import { getSykmeldingTitle } from '../utils/sykmeldingUtils'

export function useUpdateBreadcrumbs(buildBreadcrumbs: BreadcrumbBuilder): void {
    useEffect(() => {
        const updateBreadcrumbs = async () => {
            try {
                const breadcrumbs = buildBreadcrumbs()
                const completeBreadcrumbs = createCompleteBreadcrumbs(breadcrumbs)
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

    inntektsmelding: (inntektsmeldingId: string, organisasjonsnavn?: string): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        BREADCRUMB_ITEMS.INNTEKTSMELDINGER,
        createBreadcrumbItem(organisasjonsnavn || '...', `/inntektsmeldinger/${inntektsmeldingId}`),
    ],

    manglendeInntektsmelding: (): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        createBreadcrumbItem('Manglende inntektsmelding'),
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
        createBreadcrumbItem(getSykmeldingTitle(sykmelding), `/sykmeldinger/${sykmeldingId}`),
        createBreadcrumbItem('Kvittering'),
    ],

    notFound: (): CompleteBreadcrumb[] => [
        BREADCRUMB_ITEMS.DITT_SYKEFRAVAER,
        createBreadcrumbItem('Ukjent side', '/404'),
    ],

    serverError: (): CompleteBreadcrumb[] => [createBreadcrumbItem('Ukjent feil', '/500')],
}

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

type BreadcrumbItem = {
    title: string
    url: string
    handleInApp?: boolean
}

type CompleteBreadcrumb = Parameters<typeof setBreadcrumbs>[0][0]

type BreadcrumbBuilder = () => CompleteBreadcrumb[]

const BREADCRUMB_ITEMS = {
    MIN_SIDE: createBreadcrumbItem('Min side', minSideUrl(), false),
    DITT_SYKEFRAVAER: createBreadcrumbItem('Ditt sykefravær', '/'),
    SYKMELDINGER: createBreadcrumbItem('Sykmeldinger', '/sykmeldinger'),
    INNTEKTSMELDINGER: createBreadcrumbItem('Inntektsmeldinger', '/inntektsmeldinger'),
}

function createCompleteBreadcrumbs(breadcrumbs: CompleteBreadcrumb[]): CompleteBreadcrumb[] {
    return [BREADCRUMB_ITEMS.MIN_SIDE, ...breadcrumbs]
}

function createBreadcrumbItem(title: string, url?: string, handleInApp: boolean = true): CompleteBreadcrumb {
    return {
        title,
        url: url || '/',
        handleInApp,
    }
}
