import { expect, Page } from '@playwright/test'

export interface Brodsmule {
    navn: string
    href: string | RegExp
    exact?: boolean
}

export async function forventBrodsmule(page: Page, brodsmule: Brodsmule): Promise<void> {
    const brodsmuleElement = page.getByRole('link', {
        name: brodsmule.navn,
        exact: brodsmule.exact,
    })
    await expect(brodsmuleElement).toBeVisible()
    await expect(brodsmuleElement).toHaveAttribute('href', brodsmule.href)
}

export async function forventFlerebrodsmuler(page: Page, brodsmuler: Brodsmule[]): Promise<void> {
    for (const brodsmule of brodsmuler) {
        await forventBrodsmule(page, brodsmule)
    }
}

export async function klikkPaBrodsmule(page: Page, navn: string, exact?: boolean): Promise<void> {
    const brodsmuleElement = page.getByRole('link', { name: navn, exact })
    await brodsmuleElement.click()
}

export function lagBrodsmule(navn: string, href: string | RegExp, exact?: boolean): Brodsmule {
    return { navn, href, exact }
}

export const standardBrodsmuler = {
    minSide: { navn: 'Min side', href: /minside/, exact: true },
    sykefravaer: { navn: 'Ditt sykefravær', href: '/', exact: true },
    sykmeldinger: { navn: 'Sykmeldinger', href: '/sykmeldinger', exact: true },
    sykmelding: { navn: 'Sykmelding', href: /\/sykmeldinger\/.+/, exact: true },
    inntektsmeldinger: { navn: 'Inntektsmeldinger', href: '/inntektsmeldinger', exact: true },
    kvittering: { navn: 'Kvittering', href: '', exact: true },
    manglendeInntektsmelding: { navn: 'Manglende inntektsmelding', href: '', exact: true },
    opplysningerFraAordningen: { navn: 'Opplysninger fra a-ordningen', href: '', exact: true },
    ukjentSide: { navn: 'Ukjent side', href: '/404', exact: true },
    ukjentFeil: { navn: 'Ukjent feil', href: '/500', exact: true },
} as const
