import { expect } from '@playwright/test'

import {
    bekreftNarmesteleder,
    frilanserEgenmeldingsperioder,
    gotoScenario,
    navigateToFirstSykmelding,
    opplysingeneStemmer,
    sendSykmelding,
    velgArbeidssituasjon,
    velgArbeidstaker,
    velgForsikring,
} from '../utils/user-actions'
import { test } from '../utils/fixtures'
import { getRadioInGroup } from '../utils/test-utils'

test.describe('Informasjon om ventetid', () => {
    test('Kvitteringer for bekreftet sykmelding viser informasjon om ventetid', async ({ page }) => {
        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('selvstendig næringsdrivende')(page)

        await frilanserEgenmeldingsperioder('Nei')(page)
        await velgForsikring('Nei')(page)

        await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()
        await expect(page.getByText('Hva skjer videre?')).toBeVisible()
    })

    test('Kvitteringer for bekreftet sykmelding for frilanser ikke informasjon om ventetid', async ({ page }) => {
        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('frilanser')(page)

        await frilanserEgenmeldingsperioder('Nei')(page)
        await velgForsikring('Nei')(page)

        await page.getByRole('button', { name: /Bekreft sykmelding/ }).click()
        await expect(page.getByText('Hva skjer videre?')).toBeVisible()
    })

    test('Kvitteringer for sendt sykmelding viser ikke informasjon om ventetid', async ({ page }) => {
        await gotoScenario('normal')(page)
        await navigateToFirstSykmelding('nye', '100%')(page)
        await opplysingeneStemmer(page)
        await velgArbeidssituasjon('ansatt')(page)
        await velgArbeidstaker(/Pontypandy Fire Service/)(page)
        await bekreftNarmesteleder('Station Officer Steele')(page)

        await getRadioInGroup(page)(
            { name: /Brukte du egenmelding hos Pontypandy Fire Service i perioden/ },
            { name: 'Nei' },
        ).click()

        await sendSykmelding(page)

        await expect(page.getByText('Sykmeldingen ble sendt til Pontypandy Fire Service')).toBeVisible()
        await expect(page.getByText('Hva skjer videre?')).not.toBeVisible()
    })
})
