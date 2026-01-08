import { expect } from '@playwright/test'
import dayjs from 'dayjs'

import { tilLesbarDatoMedArstall } from '../src/utils/dato-utils'

import { test } from './utils/fixtures'

test.describe('Maksdato', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/syk/sykefravaer?testperson=syk-naa-med-maksdato')
        await page.emulateMedia({ reducedMotion: 'reduce' })
    })

    test('Finner maksdato kortet og kan åpne den', async ({ page }) => {
        const sisteUtbetaling = tilLesbarDatoMedArstall(dayjs().subtract(1, 'day').toDate())
        const maksdato = tilLesbarDatoMedArstall(dayjs().add(340, 'days').toDate())
        const forventetTekst = `Maksdato per ${sisteUtbetaling} er ${maksdato}`
        await page.getByRole('region', { name: 'Beregnet slutt på sykepenger' }).click()
        await expect(page.getByRole('region', { name: 'Beregnet slutt på sykepenger' })).toContainText(forventetTekst)
    })

    test('Innholdet i maksdato kortet er riktig', async ({ page }) => {
        await page.getByRole('region', { name: 'Beregnet slutt på sykepenger' }).click()

        const contentLocator = page.locator('.navds-expansioncard__content')

        await expect(contentLocator).toContainText(
            'Du kan maksimalt få sykepenger fra NAV i 52 uker. Grensen er den samme enten du er helt eller delvis sykmeldt og kalles også maksdato. Datoen gjelder hvis du er sammenhengende sykmeldt. Den vil flytte seg hvis du for eksempel ikke får sykepenger fra NAV i perioder, eller hvis du tar ferie.',
        )
        await expect(contentLocator).toContainText(
            'Sykefravær inntil 3 år tilbake i tid blir lagt sammen hvis det er mindre enn 26 uker mellom noen av fraværene.',
        )
        await expect(contentLocator).toContainText(
            'Hvis du har brukt opp de 52 ukene, må det gå 26 uker uten sykepenger eller Arbeidsavklaringspenger (AAP) før du kan få sykepenger igjen, du kan lese mer om dette i folketrygdloven § 8-12. Blir du syk på nytt før disse ukene har gått, kan det være aktuelt med AAP som erstatning for sykepenger. Ta gjerne kontakt med NAV eller snakk med veilederen din om dette.',
        )
        await expect(contentLocator).toContainText(
            'Hvis du har fått sykepenger i 52 uker og fortsatt ikke kan arbeide på grunn av sykdom eller skade, kan du ha rett til arbeidsavklaringspenger eller uføretrygd.',
        )

        await expect(page.locator('text=folketrygdloven § 8-12.')).toHaveAttribute(
            'href',
            'https://lovdata.no/nav/folketrygdloven/kap8/%C2%A78-12',
        )
        await expect(page.locator('text=Det er egne regler for deg som er mellom 67 og 70 år.')).toHaveAttribute(
            'href',
            'https://www.nav.no/sykepenger#hvor-lenge',
        )
        await expect(
            page.locator('text=Les mer om mulighetene dine etter det er slutt på sykepengene.'),
        ).toHaveAttribute('href', 'https://www.nav.no/sykepenger#hvor-lenge')
    })
})
