import { onBreadcrumbClick, setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'
import { useRouter } from 'next/router'
import { DependencyList, useCallback, useEffect, useRef } from 'react'

import { Sykmelding } from '../types/sykmelding'
import { minSideUrl } from '../utils/environment'
import { getSykmeldingTitle } from '../utils/sykmeldingUtils'

type Breadcrumb = { title: string; url: string }
type LastCrumb = { title: string }
type CompleteCrumb = Parameters<typeof setBreadcrumbs>[0][0]

const baseCrumb: CompleteCrumb = {
    title: 'Min side',
    url: minSideUrl(),
}

function createCompleteCrumbs(breadcrumbs: [...Breadcrumb[], LastCrumb] | []): CompleteCrumb[] {
    const prefixedCrumbs: CompleteCrumb[] = breadcrumbs.map(
        (it): CompleteCrumb => ({
            ...it,
            url: 'url' in it ? it.url : '/',
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

export function createInntektsmeldingBreadcrumbs(): [LastCrumb] {
    return [{ title: 'Manglende inntektsmelding' }]
}

export function createForelagtInntektBreadcrumbs(): [LastCrumb] {
    return [{ title: 'Din inntektsmelding fra Aareg' }]
}

export function createSykmeldingBreadcrumbs(sykmelding: Sykmelding | undefined): [Breadcrumb, Breadcrumb, LastCrumb] {
    return [
        { title: 'Ditt sykefravær', url: '/' },
        { title: 'Sykmeldinger', url: '/sykmeldinger' },
        { title: getSykmeldingTitle(sykmelding) },
    ]
}

export function createSykmeldingKvitteringBreadcrumbs(
    sykmeldingId: string,
    sykmelding: Sykmelding | undefined,
): [Breadcrumb, Breadcrumb, LastCrumb] {
    return [
        { title: 'Ditt sykefravær', url: '/' },
        { title: getSykmeldingTitle(sykmelding), url: `/${sykmeldingId}` },
        { title: 'Kvittering' },
    ]
}
