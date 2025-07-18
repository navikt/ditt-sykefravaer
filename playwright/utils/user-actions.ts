import { expect, Page } from '@playwright/test'

import type { Scenarios } from '../../src/data/mock/mock-db/scenarios'
import { toReadableDate } from '../../src/utils/dateUtils'

import { getRadioInGroup } from './test-utils'

export function gotoScenario(
    scenario: Scenarios = 'normal',
    options: Partial<{
        antallArbeidsgivere: 0 | 1 | 2 | 3 | 4
        erUtenforVentetid: boolean
        oppfolgingsdato: string | null
    }> = {
        antallArbeidsgivere: 1,
        erUtenforVentetid: false,
    },
) {
    return async (page: Page): Promise<void> => {
        const antallArbeidsgivere = options.antallArbeidsgivere ?? 1
        const erUtenforVentetid = options.erUtenforVentetid ?? false
        const oppfolgingsdato = options.oppfolgingsdato ?? null

        if (scenario == 'normal' && antallArbeidsgivere === 1 && !erUtenforVentetid && oppfolgingsdato == null) {
            await page.goto('/syk/sykefravaer/sykmelding/')
            return
        }

        if (scenario === 'feilmelding') {
            await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger', (route) => {
                const request = route.request()

                if (request.method() === 'GET') {
                    return route.fulfill({
                        status: 500,
                        contentType: 'application/json',
                        body: JSON.stringify({ message: 'Vi har problemer med baksystemene for øyeblikket.' }),
                    })
                }

                return route.continue()
            })

            await page.goto('/syk/sykefravaer/sykmelding/?scenario=feilmelding')
            return
        }

        if (scenario === 'sykmeldingFeil') {
            await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*', (route) => {
                const request = route.request()

                if (request.method() === 'GET') {
                    return route.fulfill({
                        status: 500,
                        contentType: 'application/json',
                        body: JSON.stringify({ message: 'Some backend error' }),
                    })
                }

                return route.continue()
            })

            await page.goto('/syk/sykefravaer/sykmelding/?scenario=sykmeldingfeil')
            return
        }

        if (scenario === 'brukerinformasjonFeil') {
            await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/brukerinformasjon', (route) => {
                const request = route.request()

                if (request.method() === 'GET') {
                    return route.fulfill({
                        status: 500,
                        contentType: 'application/json',
                        body: JSON.stringify({ message: 'Failed to fetch brukerinformasjon' }),
                    })
                }

                return route.continue()
            })

            await page.goto('/syk/sykefravaer/sykmelding/?scenario=brukerinformasjonfeil')
            return
        }

        const searchParams = new URLSearchParams({
            scenario,
            antallArbeidsgivere: antallArbeidsgivere.toString(),
            utenforVentetid: erUtenforVentetid.toString(),
            oppfolgingsdato: oppfolgingsdato ?? '',
        })

        await page.goto(`/syk/sykefravaer/sykmelding/?${searchParams.toString()}`)
    }
}

export async function gotoRoot(page: Page): Promise<void> {
    await page.goto(`/syk/sykefravaer/sykmelding/`)
}

export function navigateToFirstSykmelding(
    type: 'nye' | 'tidligere' | 'under-behandling',
    variant: '100%' | 'egenmelding' | 'papirsykmelding' | 'utenlandsk',
) {
    return async (page: Page): Promise<void> => {
        let sectionRegex: RegExp
        switch (type) {
            case 'nye':
                sectionRegex = /Nye sykmeldinger/i
                break
            case 'tidligere':
                sectionRegex = /Tidligere sykmeldinger/i
                break
            case 'under-behandling':
                sectionRegex = /Under behandling/i
                break
        }

        // Text in aria-label
        let linkRegexp: RegExp
        switch (variant) {
            case '100%':
                linkRegexp = /100% sykmelding/i
                break
            case 'egenmelding':
                linkRegexp = /Egenmelding/i
                break
            case 'papirsykmelding':
                linkRegexp = /Papirsykmelding/i
                break
            case 'utenlandsk':
                linkRegexp = /Utenlandsk/i
                break
        }

        await page
            .getByRole('region', { name: sectionRegex })
            .getByRole('link', { name: new RegExp(linkRegexp) })
            .first()
            .click()
    }
}

export async function opplysingeneStemmer(page: Page): Promise<void> {
    await getRadioInGroup(page)({ name: 'Stemmer opplysningene?' }, { name: 'Ja' }).click()
}

export function velgArbeidssituasjon(
    situasjon:
        | 'ansatt'
        | 'arbeidsledig'
        | 'annet'
        | 'fisker'
        | 'frilanser'
        | 'jordbruker'
        | 'permittert'
        | 'selvstendig næringsdrivende',
) {
    return async (page: Page): Promise<void> => {
        await getRadioInGroup(page)({ name: /Jeg er sykmeldt som/i }, { name: situasjon }).click()
    }
}

export function velgArbeidstaker(arbeidstaker: RegExp) {
    return async (page: Page): Promise<void> => {
        await getRadioInGroup(page)({ name: /Velg arbeidsgiver/i }, { name: arbeidstaker }).click()
    }
}

export function velgArbeidstakerArbeidsledig(arbeidstaker: RegExp, sykmeldtAs: string = 'arbeidsledig') {
    return async (page: Page): Promise<void> => {
        await getRadioInGroup(page)(
            { name: `Hvilken arbeidsgiver har du blitt ${sykmeldtAs}` },
            { name: arbeidstaker },
        ).click()
    }
}

export function velgForsikring(svar: 'Ja' | 'Nei') {
    return async (page: Page): Promise<void> => {
        await getRadioInGroup(page)(
            { name: /Har du forsikring som gjelder for de første 16 dagene av sykefraværet?/i },
            { name: svar },
        ).click()
    }
}

export function expectOppfolgingsdato(dato: string) {
    return async (page: Page): Promise<void> => {
        await expect(
            page.getByRole('group', { name: new RegExp(`Vi har registrert at du ble syk ${toReadableDate(dato)}`) }),
        ).toBeVisible()
    }
}

export function frilanserEgenmeldingsperioder(
    svar:
        | 'Nei'
        | {
              fom: string
              tom: string
          }[],
) {
    return async (page: Page): Promise<void> => {
        const jaEllerNei = Array.isArray(svar) ? 'Ja' : 'Nei'
        await getRadioInGroup(page)(
            { name: /Brukte du egenmelding eller papirsykmelding før denne datoen?/i },
            { name: jaEllerNei },
        ).click()

        if (Array.isArray(svar)) {
            let index = 0
            for (const { fom, tom } of svar) {
                await page.getByRole('textbox', { name: 'Fra og med' }).nth(index).fill(fom)
                await page.getByRole('textbox', { name: 'Til og med' }).nth(index).fill(tom)
                if (index < svar.length - 1) {
                    await page.getByRole('button', { name: 'Legg til' }).nth(0).click()
                }
                index++
            }
        }
    }
}

export function bekreftNarmesteleder(narmesteleder: string, svar: 'Ja' | 'Nei' = 'Ja') {
    return async (page: Page): Promise<void> => {
        await getRadioInGroup(page)(
            { name: new RegExp(`Er det ${narmesteleder} som skal følge deg opp på jobben mens du er syk`, 'i') },
            { name: svar },
        ).click()
    }
}

export async function sendSykmelding(page: Page): Promise<void> {
    await page.getByRole('button', { name: /Send sykmelding/ }).click()
    await page.waitForURL('**/kvittering')
}

export async function bekreftSykmelding(page: Page): Promise<void> {
    await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()
    await page.waitForURL('**/kvittering')
}

export function filloutArbeidstaker(arbeidstaker: RegExp): (page: Page) => Promise<void> {
    return async (page: Page): Promise<void> => {
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('ansatt')(page)
        await velgArbeidstaker(arbeidstaker)(page)
    }
}

export function fillOutFisker(
    blad: `Blad ${'A' | 'B'}`,
    lott: 'Lott' | 'Hyre' | 'Både lott og hyre',
): (page: Page) => Promise<void> {
    return async (page: Page): Promise<void> => {
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('fisker')(page)
        await getRadioInGroup(page)({ name: /Velg blad/i }, { name: blad }).click()
        await getRadioInGroup(page)(
            { name: /Mottar du lott eller er du på hyre?/i },
            { name: lott, exact: true },
        ).click()
    }
}

export function velgAnnetSituasjon(
    situasjon:
        | 'Pensjonist'
        | 'Student'
        | 'Vikar'
        | 'Lærling'
        | 'Dagpenger'
        | 'Flere arbeidsforhold'
        | 'Arbeidsavklaringspenger (AAP)'
        | 'Uføretrygd',
) {
    return async (page: Page): Promise<void> => {
        await page
            .getByRole('combobox', { name: 'Hvilken situasjon er du i som gjorde at du valgte annet?' })
            .selectOption(situasjon)
    }
}
