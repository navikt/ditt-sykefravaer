import { expect, Page, test } from '@playwright/test'
import { format } from 'date-fns'

import { bekreftNarmesteleder, filloutArbeidstaker, gotoScenario } from '../utils/user-actions'
import { expectDineSvar, expectKvittering, ExpectMeta } from '../utils/user-expects'

function egenmeldingsdagerSection(page: Page, sectionLegend: string) {
    const section = page.getByRole('region', { name: 'Brukte du egenmelding hos' }).filter({ hasText: sectionLegend })
    return {
        svar: {
            jaButton: section.getByRole('radio', { name: /Ja/ }),
            neiButton: section.getByRole('radio', { name: /Nei/ }),
        },
        dagButton: (dag: string | Date) => {
            const dato = typeof dag === 'string' ? dag : format(dag, 'yyyy-MM-dd')
            return section.locator(`td[data-day="${dato}"]`)
        },
        videreButton: section.getByRole('button', { name: /Videre/ }),
    }
}

function velgEgenmeldingsdager(sectionLegend: string, dager: (string | Date)[]) {
    return async (page: Page): Promise<void> => {
        const egenmeldingsdager = egenmeldingsdagerSection(page, sectionLegend)
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
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
                ['2025-01-05', '2025-01-06'],
            )(page)
            await egenmeldingsdagerSection(
                page,
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 19. - 22. desember 2024?',
            ).svar.neiButton.click()

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
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
                ['2025-01-04', '2025-01-05'],
            )(page)
            await velgEgenmeldingsdager(
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 18. - 22. desember 2024?',
                ['2024-12-21', '2024-12-22'],
            )(page)
            await egenmeldingsdagerSection(
                page,
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 4. - 17. desember 2024?',
            ).svar.neiButton.click()

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
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 23. desember 2024 - 7. januar 2025?',
                ['2025-01-05', '2025-01-06'],
            )(page)

            await velgEgenmeldingsdager(
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 19. - 22. desember 2024?',
                ['2024-12-21', '2024-12-22'],
            )(page)
            await egenmeldingsdagerSection(
                page,
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 4. - 18. desember 2024?',
            ).svar.neiButton.click()

            await egenmeldingsdagerSection(
                page,
                'Brukte du egenmelding hos Pontypandy Fire Service i perioden 19. - 22. desember 2024?',
            ).svar.neiButton.click()

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

        //     test.describe('begrenser til 16 egenmeldingsdager', () => {
        //         const pickArbeidsgiverAndBoss = async (page: Page): Promise<void> => {
        //             await gotoScenario('kunNy')(page)
        //             await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
        //             await bekreftNarmesteleder('Station Officer Steele')(page)
        //         }
        //
        //         const expect16EgenmeldingsdagerAndEverythingGood = async (page: Page): Promise<void> => {
        //             await expect(
        //                 page.getByText('Du har valgt 16 egenmeldingsdager, og trenger ikke å velge flere.'),
        //             ).toBeVisible()
        //
        //             await expectNumberOfEgenmeldingsdagerInput(16)(page)
        //
        //             await page.getByRole('button', { name: /Send sykmelding/ }).click()
        //
        //             await expectKvittering({
        //                 sendtTil: 'Pontypandy Fire Service',
        //                 egenmeldingsdagerInfo: ExpectMeta.InDom,
        //             })(page)
        //
        //             await expectDineSvar({
        //                 arbeidssituasjon: 'Ansatt',
        //                 narmesteleder: {
        //                     navn: 'Station Officer Steele',
        //                     svar: 'Ja',
        //                 },
        //                 egenmeldingsdager: {
        //                     arbeidsgiver: 'Pontypandy Fire Service',
        //                     antallDager: 16,
        //                 },
        //             })(page)
        //         }
        //
        //         test('burde få advarsel, men kunne sende inn sykmelding når man velger 16 egenmeldingsdager i en enkelt periode', async ({
        //             page,
        //         }) => {
        //             await pickArbeidsgiverAndBoss(page)
        //             await selectEgenmeldingsdager({
        //                 velgDager: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], ExpectMeta.NotInDom],
        //                 initialDate: sub(testDato, { days: 9 }),
        //             })(page)
        //
        //             await expect16EgenmeldingsdagerAndEverythingGood(page)
        //         })
        //
        //         test('burde få advarsel, men kunne sende inn sykmelding når man velger 16 egenmeldingsdager over to perioder', async ({
        //             page,
        //         }) => {
        //             await pickArbeidsgiverAndBoss(page)
        //             await selectEgenmeldingsdager({
        //                 velgDager: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [2], ExpectMeta.NotInDom],
        //                 initialDate: sub(testDato, { days: 9 }),
        //             })(page)
        //
        //             await expect16EgenmeldingsdagerAndEverythingGood(page)
        //         })
        //
        //         test('burde få advarsel, men kunne sende inn sykmelding når man velger 16 egenmeldingsdager over flere perioder', async ({
        //             page,
        //         }) => {
        //             await pickArbeidsgiverAndBoss(page)
        //             await selectEgenmeldingsdager({
        //                 velgDager: [
        //                     [0, 2, 4, 6],
        //                     [2, 4, 9],
        //                     [2, 8],
        //                     [3], // Comment so prettier keeps this beautiful thing
        //                     [4, 8],
        //                     [3, 5, 7, 9],
        //                     ExpectMeta.NotInDom,
        //                 ],
        //                 initialDate: sub(testDato, { days: 9 }),
        //             })(page)
        //
        //             await expect16EgenmeldingsdagerAndEverythingGood(page)
        //         })
        //
        //         test('burde få advarsel, men kunne sende inn sykmelding når man velger 16 egenmeldingsdager i 16 enkeldager-perioder', async ({
        //             page,
        //         }) => {
        //             await gotoScenario('kunNy')(page)
        //             await filloutArbeidstaker(/Pontypandy Fire Service/)(page)
        //             await bekreftNarmesteleder('Station Officer Steele')(page)
        //             await selectEgenmeldingsdager({
        //                 velgDager: [...R.range(0, 16).map(() => [0]), ExpectMeta.NotInDom],
        //                 initialDate: sub(testDato, { days: 9 }),
        //             })(page)
        //
        //             await expect16EgenmeldingsdagerAndEverythingGood(page)
        //         })
        //     })
        // })
        // test.describe('Fisker', () => {
        //     test('burde kunne sende inn sykmelding med egenmeldingsdager', async ({ page }) => {
        //         await gotoScenario('normal')(page)
        //         await fillOutFisker('Blad A', 'Hyre')(page)
        //         await velgArbeidstaker(/Pontypandy Fire Service/)(page)
        //         await bekreftNarmesteleder('Station Officer Steele')(page)
        //
        //         await selectEgenmeldingsdager({
        //             velgDager: [[14, 13], 'Nei'],
        //             initialDate: sub(testDato, { days: 9 }),
        //         })(page)
        //
        //         await expectNumberOfEgenmeldingsdagerInput(2)(page)
        //
        //         await page.getByRole('button', { name: /Send sykmelding/ }).click()
        //
        //         await expectKvittering({
        //             sendtTil: 'Pontypandy Fire Service',
        //             egenmeldingsdagerInfo: ExpectMeta.InDom,
        //         })(page)
        //
        //         await expectDineSvar({
        //             arbeidssituasjon: 'Fisker',
        //             narmesteleder: {
        //                 navn: 'Station Officer Steele',
        //                 svar: 'Ja',
        //             },
        //             egenmeldingsdager: {
        //                 arbeidsgiver: 'Pontypandy Fire Service',
        //                 antallDager: 2,
        //             },
        //         })(page)
        //     })
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
