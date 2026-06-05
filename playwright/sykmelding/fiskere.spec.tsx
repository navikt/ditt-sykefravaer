import { expect, test } from '@playwright/test'

import {
    bekreftNarmesteleder,
    bekreftSykmelding,
    fillOutFisker,
    frilanserEgenmeldingsperioder,
    gotoScenario,
    sendSykmelding,
    velgArbeidstaker,
    velgForsikring,
} from '../utils/user-actions'
import { getRadioInGroup } from '../utils/test-utils'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { testAar } from '../../src/data/mock/mock-db/data-creators'

test.describe('Arbeidssituasjon - Fiskere', () => {
    test.describe('Feil ved henting av data', () => {
        test('skal deaktivere send-knapp mens data lastes', async ({ page }) => {
            await page.route(
                '**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-utenfor-ventetid',
                async (route) => {
                    if (route.request().method() === 'GET') {
                        await page.waitForTimeout(5000)
                        return route.continue()
                    }
                    return route.continue()
                },
            )

            await gotoScenario('normal')(page)
            await fillOutFisker('Blad A', 'Lott')(page)

            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
            await page.unrouteAll({ behavior: 'ignoreErrors' })
        })

        test('skal deaktivere send-knapp når er-forste-sykmelding feiler', async ({ page }) => {
            await page.route(
                '**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-forste-sykmelding/**',
                (route) => {
                    if (route.request().method() === 'GET') {
                        return route.fulfill({
                            status: 500,
                            contentType: 'application/json',
                            body: JSON.stringify({ message: 'Failed to fetch er-forste-sykmelding' }),
                        })
                    }
                    return route.continue()
                },
            )

            await gotoScenario('normal')(page)
            await fillOutFisker('Blad A', 'Lott')(page)

            await expect(
                page.getByText(
                    /Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen/,
                ),
            ).toBeVisible()

            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
        })

        test('skal deaktivere send-knapp når er-utenfor-ventetid feiler', async ({ page }) => {
            await page.route('**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-utenfor-ventetid', (route) => {
                if (route.request().method() === 'GET') {
                    return route.fulfill({
                        status: 500,
                        contentType: 'application/json',
                        body: JSON.stringify({ message: 'Failed to fetch er-utenfor-ventetid' }),
                    })
                }
                return route.continue()
            })

            await gotoScenario('normal')(page)
            await fillOutFisker('Blad A', 'Lott')(page)

            await expect(
                page.getByText(
                    /Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen/,
                ),
            ).toBeVisible()

            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
        })

        test('skal deaktivere send-knapp mens er-forste-sykmelding lastes', async ({ page }) => {
            await page.route(
                '**/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/*/er-forste-sykmelding/**',
                async (route) => {
                    if (route.request().method() === 'GET') {
                        await page.waitForTimeout(5000)
                        return route.continue()
                    }
                    return route.continue()
                },
            )

            await gotoScenario('normal')(page)
            await fillOutFisker('Blad A', 'Lott')(page)

            await expect(page.getByRole('button', { name: /Bekreft sykmelding/ })).toBeDisabled()
            await page.unrouteAll({ behavior: 'ignoreErrors' })
        })
    })

    test.describe('Blad A', () => {
        test('Lott, skal oppføre seg som næringsdrivende', async ({ page }) => {
            await gotoScenario('normal')(page)
            // Behaves similar to normal nearingsdrivende
            await fillOutFisker('Blad A', 'Lott')(page)
            await frilanserEgenmeldingsperioder([
                {
                    fom: `01.01.${testAar}`,
                },
            ])(page)
            await velgForsikring('Ja')(page)

            await bekreftSykmelding(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Fisker',
                selvstendig: {
                    egenmeldingsperioder: [`1. januar ${testAar}`],
                    forsikring: 'Ja',
                },
                fisker: {
                    blad: 'A',
                    lottEllerHyre: 'Lott',
                },
            })(page)
        })

        test('Lott, skal ikke vise fravær før sykmeldingen når ikke er første sykmelding og er utenfor ventetid', async ({
            page,
        }) => {
            await gotoScenario('normal', {
                erForsteSykmelding: false,
                erUtenforVentetid: true,
            })(page)
            await fillOutFisker('Blad A', 'Lott')(page)

            await expect(page.getByRole('region', { name: 'Fravær før sykmeldingen' })).not.toBeVisible()
        })

        test('Hyre, skal oppføre seg som arbeidsgiver', async ({ page }) => {
            await gotoScenario('normal')(page)
            await fillOutFisker('Blad A', 'Hyre')(page)
            // Hyre behaves similar to normal arbeidstaker
            await velgArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)
            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Pontypandy Fire Service/ },
                { name: 'Nei' },
            ).click()
            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Fisker',
                arbeidsgiver: '110110110',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                fisker: {
                    blad: 'A',
                    lottEllerHyre: 'Hyre',
                },
            })(page)
        })

        test('Lott & Hyre, skal oppføre seg som arbeidsgiver', async ({ page }) => {
            await gotoScenario('normal')(page)
            await fillOutFisker('Blad A', 'Både lott og hyre')(page)
            // 'Begge' behaves similar to normal arbeidstaker
            await velgArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)
            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Pontypandy Fire Service/ },
                { name: 'Nei' },
            ).click()
            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Fisker',
                arbeidsgiver: '110110110',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                fisker: {
                    blad: 'A',
                    lottEllerHyre: 'Begge',
                },
            })(page)
        })
    })

    test.describe('Blad B', () => {
        test('Lott skal ikke ha ekstra spørsmål', async ({ page }) => {
            await gotoScenario('normal')(page)
            await fillOutFisker('Blad B', 'Lott')(page)
            await bekreftSykmelding(page)

            await expectKvittering({
                sendtTil: 'NAV',
                egenmeldingsdagerInfo: ExpectMeta.NotInDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Fisker',
                fisker: {
                    blad: 'B',
                    lottEllerHyre: 'Lott',
                },
            })(page)
        })

        test('Hyre, skal oppføre seg som arbeidsgiver', async ({ page }) => {
            await gotoScenario('normal')(page)
            await fillOutFisker('Blad B', 'Hyre')(page)
            // Hyre behaves similar to normal arbeidstaker
            await velgArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)
            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Pontypandy Fire Service/ },
                { name: 'Nei' },
            ).click()
            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Fisker',
                arbeidsgiver: 'Pontypandy Fire Service',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                fisker: {
                    blad: 'B',
                    lottEllerHyre: 'Hyre',
                },
            })(page)
        })

        test('Lott & Hyre, skal oppføre seg som arbeidsgiver', async ({ page }) => {
            await gotoScenario('normal')(page)
            await fillOutFisker('Blad B', 'Både lott og hyre')(page)
            // 'Begge' behaves similar to normal arbeidstaker
            await velgArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)
            await getRadioInGroup(page)(
                { name: /Brukte du egenmelding hos Pontypandy Fire Service/ },
                { name: 'Nei' },
            ).click()
            await sendSykmelding(page)

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Fisker',
                arbeidsgiver: 'Pontypandy Fire Service',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                fisker: {
                    blad: 'B',
                    lottEllerHyre: 'Begge',
                },
            })(page)
        })
    })

    test.describe('uten arbeidsgiver', () => {
        test('Hyre eller Lott & Hyre uten arbeidsgivere skal gi advarsel/tips om hva man bør gjøre', async ({
            page,
        }) => {
            await gotoScenario('normal', {
                antallArbeidsgivere: 0,
            })(page)
            await fillOutFisker('Blad B', 'Både lott og hyre')(page)

            const expectedHint =
                'Hvis det stemmer at arbeidsforholdet ditt ikke skal registreres, kan du sende inn sykmeldingen til NAV som fisker ved å velge lott i stedet for hyre.'

            await expect(page.getByText(expectedHint)).toBeVisible()

            await getRadioInGroup(page)(
                { name: /Mottar du lott eller er du på hyre?/i },
                { name: 'Hyre', exact: true },
            ).click()

            await expect(page.getByText(expectedHint)).toBeVisible()
        })

        test('Hyre eller Lott & Hyre skal gi feil hvis bruker prøver å sende sykmelding uten arbeidsgivere', async ({
            page,
        }) => {
            await gotoScenario('normal', {
                antallArbeidsgivere: 0,
            })(page)
            await fillOutFisker('Blad B', 'Både lott og hyre')(page)

            const expectedHint =
                'Hvis det stemmer at arbeidsforholdet ditt ikke skal registreres, kan du sende inn sykmeldingen til NAV som fisker ved å velge lott i stedet for hyre.'

            await expect(page.getByText(expectedHint)).toBeVisible()

            await getRadioInGroup(page)(
                { name: /Mottar du lott eller er du på hyre?/i },
                { name: 'Hyre', exact: true },
            ).click()

            await expect(page.getByText(expectedHint)).toBeVisible()

            await page.getByRole('button', { name: /Send sykmelding/ }).click()
            await expect(
                page.getByText(
                    /Sykmeldingen ble ikke sendt.*For å sende inn sykmeldingen må du fylle ut hvilket arbeidsforhold du er sykmeldt fra/,
                ),
            ).toBeVisible()
        })
    })
})
