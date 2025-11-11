import { expect, Locator, Page, test } from '@playwright/test'
import { TZDate } from '@date-fns/tz'

import {
    bekreftNarmesteleder,
    filloutArbeidstaker,
    fillOutFisker,
    gotoScenario,
    velgArbeidstaker,
} from '../utils/user-actions'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'
import { dateSub, toDate, toDateString, toReadableDatePeriod } from '../../src/utils/dateUtils'

type EgenmeldingsdagerHjelper = {
    svar: {
        jaButton: Locator
        neiButton: Locator
    }
    dagButton: (dag: string) => Locator
    forrigeManedKnapp: Locator
    nesteManedKnapp: Locator
    videreButton: Locator
}

function egenmeldingsdagerHjelper(sectionLegend: string) {
    return (page: Page): EgenmeldingsdagerHjelper => {
        const section = page
            .getByRole('region', { name: 'Brukte du egenmelding hos' })
            .filter({ hasText: sectionLegend })
        return {
            svar: {
                jaButton: section.getByRole('radio', { name: /Ja/ }),
                neiButton: section.getByRole('radio', { name: /Nei/ }),
            },
            dagButton: (dag: string) => {
                return section.locator(`td[data-day="${dag}"]:not([data-outside])`)
            },
            forrigeManedKnapp: section.getByRole('button', { name: 'Gå til forrige måned' }),
            nesteManedKnapp: section.getByRole('button', { name: 'Gå til neste måned' }),
            videreButton: section.getByRole('button', { name: /Videre/ }),
        }
    }
}

function velgEgenmeldingsdager(egenmeldingsdagerHjelper: (page: Page) => EgenmeldingsdagerHjelper, dager: string[]) {
    return async (page: Page): Promise<void> => {
        const egenmeldingsdager = egenmeldingsdagerHjelper(page)
        await egenmeldingsdager.svar.jaButton.click()
        for (const dag of dager) {
            await egenmeldingsdager.dagButton(dag).click()
        }
        await egenmeldingsdager.videreButton.click()
    }
}

test.describe('Egenmeldingsdager', () => {
    test.describe('Arbeidstaker', () => {
        test('burde kunne sende inn sykmelding med en periode med egenmelding', async ({ page }) => {
            await gotoScenario('normal')(page)
            await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)

            await velgEgenmeldingsdager(
                egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
                ),
                ['2025-01-05', '2025-01-06'],
            )(page)
            await egenmeldingsdagerHjelper(
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 20. - 22. desember 2024?',
            )(page).svar.neiButton.click()

            await expectNumberOfEgenmeldingsdagerInput(2)(page)

            await page.getByRole('button', { name: /Send sykmelding/ }).click()

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                egenmeldingsdager: {
                    arbeidsgiver: 'Pontypandy Fire Service',
                    antallDager: 2,
                },
            })(page)
        })

        test('burde kunne sende inn sykmelding med to perioder med egenmelding', async ({ page }) => {
            await gotoScenario('normal')(page)
            await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)

            await velgEgenmeldingsdager(
                egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
                ),
                ['2025-01-04', '2025-01-05'],
            )(page)
            await velgEgenmeldingsdager(
                egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 19. - 22. desember 2024?',
                ),
                ['2024-12-21', '2024-12-22'],
            )(page)
            await egenmeldingsdagerHjelper(
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 5. - 18. desember 2024?',
            )(page).svar.neiButton.click()

            await expectNumberOfEgenmeldingsdagerInput(4)(page)

            await page.getByRole('button', { name: /Send sykmelding/ }).click()

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                egenmeldingsdager: {
                    arbeidsgiver: 'Pontypandy Fire Service',
                    antallDager: 4,
                },
            })(page)
        })

        test('burde kunne sende inn sykmelding etter å redigere forride periode med egenmeldingsdager', async ({
            page,
        }) => {
            await gotoScenario('normal')(page)
            await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
            await bekreftNarmesteleder('Station Officer Steele')(page)

            await velgEgenmeldingsdager(
                egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
                ),
                ['2025-01-05', '2025-01-06'],
            )(page)

            await velgEgenmeldingsdager(
                egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 20. - 22. desember 2024?',
                ),
                ['2024-12-21', '2024-12-22'],
            )(page)
            await egenmeldingsdagerHjelper(
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 5. - 19. desember 2024?',
            )(page).svar.neiButton.click()

            await egenmeldingsdagerHjelper(
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 20. - 22. desember 2024?',
            )(page).svar.neiButton.click()

            await expectNumberOfEgenmeldingsdagerInput(2)(page)

            await page.getByRole('button', { name: /Send sykmelding/ }).click()

            await expectKvittering({
                sendtTil: 'Pontypandy Fire Service',
                egenmeldingsdagerInfo: ExpectMeta.InDom,
            })(page)

            await expectDineSvar({
                arbeidssituasjon: 'Ansatt',
                narmesteleder: {
                    navn: 'Station Officer Steele',
                    svar: 'Ja',
                },
                egenmeldingsdager: {
                    arbeidsgiver: 'Pontypandy Fire Service',
                    antallDager: 2,
                },
            })(page)
        })

        test.describe('begrenser til 16 egenmeldingsdager', () => {
            const pickArbeidsgiverAndBoss = async (page: Page): Promise<void> => {
                await gotoScenario('kunNy')(page)
                await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
                await bekreftNarmesteleder('Station Officer Steele')(page)
            }

            const expect16EgenmeldingsdagerAndEverythingGood = async (page: Page): Promise<void> => {
                await expect(
                    page.getByText('Du har valgt 16 egenmeldingsdager, og trenger ikke å velge flere.'),
                ).toBeVisible()

                await expectNumberOfEgenmeldingsdagerInput(16)(page)

                await page.getByRole('button', { name: /Send sykmelding/ }).click()

                await expectKvittering({
                    sendtTil: 'Pontypandy Fire Service',
                    egenmeldingsdagerInfo: ExpectMeta.InDom,
                })(page)

                await expectDineSvar({
                    arbeidssituasjon: 'Ansatt',
                    narmesteleder: {
                        navn: 'Station Officer Steele',
                        svar: 'Ja',
                    },
                    egenmeldingsdager: {
                        arbeidsgiver: 'Pontypandy Fire Service',
                        antallDager: 16,
                    },
                })(page)
            }

            test('burde få advarsel, men kunne sende inn sykmelding når man velger 16 egenmeldingsdager i en enkelt periode', async ({
                page,
            }) => {
                await pickArbeidsgiverAndBoss(page)

                const egenmeldingsdager = egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 5. - 20. januar 2025?',
                )(page)
                await egenmeldingsdager.svar.jaButton.click()
                for (const dag of [
                    '2025-01-05',
                    '2025-01-06',
                    '2025-01-07',
                    '2025-01-08',
                    '2025-01-09',
                    '2025-01-10',
                    '2025-01-11',
                    '2025-01-12',
                    '2025-01-13',
                    '2025-01-14',
                    '2025-01-15',
                    '2025-01-16',
                    '2025-01-17',
                    '2025-01-18',
                    '2025-01-19',
                    '2025-01-20',
                ]) {
                    await egenmeldingsdager.dagButton(dag).click()
                }

                await egenmeldingsdager.videreButton.click()

                await expect16EgenmeldingsdagerAndEverythingGood(page)
            })

            test('burde få advarsel, men kunne sende inn sykmelding når man velger 16 egenmeldingsdager over flere perioder', async ({
                page,
            }) => {
                await pickArbeidsgiverAndBoss(page)

                const forstePeriode = egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 5. - 20. januar 2025?',
                )(page)
                await forstePeriode.svar.jaButton.click()
                for (const dag of [
                    '2025-01-08',
                    '2025-01-09',
                    '2025-01-10',
                    '2025-01-11',
                    '2025-01-12',
                    '2025-01-13',
                    '2025-01-14',
                    '2025-01-15',
                    '2025-01-16',
                    '2025-01-17',
                ]) {
                    await forstePeriode.dagButton(dag).click()
                }
                await forstePeriode.videreButton.click()

                const andrePeriode = egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 4. januar 2025?',
                )(page)
                await andrePeriode.svar.jaButton.click()
                for (const dag of ['2024-12-27', '2024-12-28', '2024-12-29']) {
                    const dagKnapp = andrePeriode.dagButton(dag)
                    if (!(await dagKnapp.isVisible())) {
                        await andrePeriode.forrigeManedKnapp.click()
                    }
                    await dagKnapp.click()
                }
                await andrePeriode.videreButton.click()

                const tredjePeriode = egenmeldingsdagerHjelper(
                    'Brukte du egenmelding hos Pontypandy Fire Service i perioden 11. - 22. desember 2024?',
                )(page)
                await tredjePeriode.svar.jaButton.click()
                for (const dag of ['2024-12-14', '2024-12-15', '2024-12-16']) {
                    await tredjePeriode.dagButton(dag).click()
                }
                await tredjePeriode.videreButton.click()

                await expect16EgenmeldingsdagerAndEverythingGood(page)
            })

            test('burde få advarsel, men kunne sende inn sykmelding når man velger 16 egenmeldingsdager i 16 enkeldager-perioder', async ({
                page,
            }) => {
                await pickArbeidsgiverAndBoss(page)
                let egenmeldingdatoMax = new TZDate(2025, 0, 20)

                for (let periodeIndex = 1; periodeIndex < 17; periodeIndex++) {
                    const egenmeldingdatoMin = toDate(dateSub(egenmeldingdatoMax, { days: 15 }))

                    const periodeTekst = toReadableDatePeriod(egenmeldingdatoMin, egenmeldingdatoMax)
                    const valgDatoString = `Brukte du egenmelding hos Pontypandy Fire Service i perioden ${periodeTekst}?`

                    const periode = egenmeldingsdagerHjelper(valgDatoString)(page)
                    await periode.svar.jaButton.click()

                    const datoKnapp = periode.dagButton(toDateString(egenmeldingdatoMin))
                    if (!(await datoKnapp.isVisible())) {
                        if (await periode.forrigeManedKnapp.isVisible()) {
                            await periode.forrigeManedKnapp.click()
                        } else {
                            await periode.nesteManedKnapp.click()
                        }
                    }
                    await datoKnapp.click()
                    await periode.videreButton.click()

                    egenmeldingdatoMax = new TZDate(dateSub(egenmeldingdatoMin, { days: 1 }))
                }

                await expect16EgenmeldingsdagerAndEverythingGood(page)
            })

            test.describe('Fisker', () => {
                test('burde kunne sende inn sykmelding med egenmeldingsdager', async ({ page }) => {
                    await gotoScenario('normal')(page)
                    await fillOutFisker('Blad A', 'Hyre')(page)
                    await velgArbeidstaker(/Pontypandy Fire Service/)(page)
                    await bekreftNarmesteleder('Station Officer Steele')(page)

                    await velgEgenmeldingsdager(
                        egenmeldingsdagerHjelper(
                            'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
                        ),
                        ['2025-01-05', '2025-01-06'],
                    )(page)
                    await egenmeldingsdagerHjelper(
                        'Brukte du egenmelding hos Pontypandy Fire Service i perioden 20. - 22. desember 2024?',
                    )(page).svar.neiButton.click()

                    await expectNumberOfEgenmeldingsdagerInput(2)(page)

                    await page.getByRole('button', { name: /Send sykmelding/ }).click()

                    await expectKvittering({
                        sendtTil: 'Pontypandy Fire Service',
                        egenmeldingsdagerInfo: ExpectMeta.InDom,
                    })(page)

                    await expectDineSvar({
                        arbeidssituasjon: 'Fisker',
                        narmesteleder: {
                            navn: 'Station Officer Steele',
                            svar: 'Ja',
                        },
                        egenmeldingsdager: {
                            arbeidsgiver: 'Pontypandy Fire Service',
                            antallDager: 2,
                        },
                    })(page)
                })
            })
        })
    })
})

function expectNumberOfEgenmeldingsdagerInput(expectedNumberOfDays: number) {
    return async (page: Page): Promise<void> => {
        const visesTilArbeidsgiverSection = page.getByRole('region', { name: 'Se hva som sendes til jobben din' })
        await visesTilArbeidsgiverSection.click()

        await expect(
            visesTilArbeidsgiverSection
                .getByRole('region', { name: 'Perioder (f.o.m. - t.o.m.)' })
                .getByText(`(${expectedNumberOfDays} dager)`),
        ).toBeVisible()
        await visesTilArbeidsgiverSection.click()
    }
}
