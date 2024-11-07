import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'
import { useRouter } from 'next/router'
import { DependencyList, useCallback, useEffect, useRef } from 'react'

import { minSideUrl } from '../utils/environment'

type Breadcrumb = { title: string; url: string }
type LastCrumb = { title: string; url?: string }
type CompleteCrumb = Parameters<typeof setBreadcrumbs>[0][0]

const baseCrumb: CompleteCrumb = {
    title: 'Min side',
    url: minSideUrl(),
}

function createCompleteCrumbs(breadcrumbs: [...Breadcrumb[], LastCrumb] | []): CompleteCrumb[] {
    const prefixedCrumbs: CompleteCrumb[] = breadcrumbs.map(
        (it): CompleteCrumb => ({
            ...it,
            url: it.url ?? '/',
            handleInApp: true,
        }),
    )

    return [baseCrumb, ...prefixedCrumbs]
}

export function useUpdateBreadcrumbs(makeCrumbs: () => [...Breadcrumb[], LastCrumb] | [], deps?: DependencyList): void {
    const makeCrumbsRef = useRef(makeCrumbs)

    useEffect(() => {
        makeCrumbsRef.current = makeCrumbs
    }, [makeCrumbs])

    useEffect(() => {
        ;(async () => {
            try {
                const prefixedCrumbs = createCompleteCrumbs(makeCrumbsRef.current())
                await setBreadcrumbs(prefixedCrumbs)
            } catch (e) {
                logger.error(e, `Klarte ikke å oppdatere breadcrumbs på ${location.pathname}.`)
            }
        })()
        // Custom hook that passes deps array to useEffect, linting will be done where useUpdateBreadcrumbs is used
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
}

export function useHandleDecoratorClicks(): void {
    const router = useRouter()
    const callback = useCallback(
        (breadcrumb: Breadcrumb) => {
            // router.push automatically pre-pends the base route of the application
            router.push(breadcrumb.url)
        },
        [router],
    )

    useEffect(() => {
        onBreadcrumbClick(callback)
    })
}

export function createInntektsmeldingBreadcrumbs(): [Breadcrumb, LastCrumb] {
    return [baseCrumb, { title: 'Manglende inntektsmelding' }]
}

export function createForelagtInntektBreadcrumbs(): [Breadcrumb, LastCrumb] {
    return [baseCrumb, { title: 'Din inntektsmelding fra Aareg' }]
}

export enum SsrPathVariants {
    NotFound = '/404',
    ServerError = '/500',
    DittSykefravaer = '/',
    Inntektsmelding = '/inntektsmelding',
    Inntektsmeldinger = '/inntektsmeldinger',
    Beskjed = '/beskjed/[id]',
}

export function createInitialServerSideBreadcrumbs(pathname: SsrPathVariants | string): CompleteCrumb[] {
    switch (pathname) {
        case SsrPathVariants.NotFound:
        case SsrPathVariants.ServerError:
        case SsrPathVariants.DittSykefravaer:
            return createCompleteCrumbs([])
        case SsrPathVariants.Inntektsmeldinger:
            return createCompleteCrumbs([baseCrumb, { title: 'Inntektsmeldinger' }])

        case SsrPathVariants.Inntektsmelding:
            return createCompleteCrumbs(createInntektsmeldingBreadcrumbs())

        case SsrPathVariants.Beskjed:
            return createCompleteCrumbs(createForelagtInntektBreadcrumbs())

        default:
            logger.info(`Unknown initial path (${pathname}), defaulting to just base breadcrumb`)
            return createCompleteCrumbs([])
    }
}
