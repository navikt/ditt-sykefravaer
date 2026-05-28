# AGENTS.md — Copilot-instruksjoner for ditt-sykefravaer

## Prosjekt
Next.js-frontend for sykmeldte brukere. Stack: TypeScript, Next.js, Aksel Design System, React Query.

## Testing

### Playwright E2E-tester (obligatorisk ved ny funksjonalitet)
Alle nye funksjoner og endringer i brukerflyt **skal** følges av Playwright-tester.

Testfiler ligger i `playwright/` og er organisert etter domene:
- `playwright/sykmelding/` — sykmeldingrelaterte tester
- `playwright/*.spec.ts` — øvrige tester

**Når du skal skrive Playwright-tester:**
1. Legg testen i riktig undermappe under `playwright/`
2. Importer `test` og `expect` fra `playwright/utils/fixtures` (ikke direkte fra `@playwright/test`)
3. Bruk hjelpefunksjonene i `playwright/utils/` fremfor rå `page.getBy*`-kall (se tabell under)
4. Bruk `gotoScenario()` fra `playwright/utils/user-actions` for å sette opp tilstand
5. Bruk `navigateToFirstSykmelding()` der du trenger å åpne en spesifikk sykmelding
6. Legg til `validerAxe(page, testInfo)` på positive tester for tilgjengelighetssjekk
7. Opprett nye scenarios i `src/data/mock/mock-db/scenarios.ts` ved behov
8. Utvid `SykmeldingBuilder` i `src/data/mock/mock-db/data-creators.ts` om testdataen mangler

### Playwright-utils — bruk disse fremfor rå page-kall

| Funksjon | Fra | Bruksområde |
|----------|-----|-------------|
| `harSynligOverskrift(page, tekst, level)` | `utils/test-utils` | Sjekk at en heading er synlig |
| `harSynligTekst(page, tekst)` | `utils/test-utils` | Sjekk at en tekst er synlig |
| `apneReadmore(page, tittel, [forventetTekst])` | `utils/test-utils` | Åpne ReadMore og verifiser innhold |
| `getRadioInGroup(page)(group, radio)` | `utils/test-utils` | Velg radioknapp i gruppe |
| `getCheckboxInGroup(page)(group, cb)` | `utils/test-utils` | Velg checkbox i gruppe |
| `validerAxe(page, testInfo)` | `utils/uuvalidering` | WCAG-sjekk (legg til på positive tester) |
| `validerCLS(getCLS, navn)` | `utils/cls-validering` | Layout stability-sjekk |
| `expectKvittering(opts)` | `utils/user-expects` | Verifiser kvitteringsside (SENDT) |
| `expectDineSvar(svar)` | `utils/user-expects` | Verifiser brukerens svar-seksjon |
| `gotoScenario(scenario, opts)` | `utils/user-actions` | Naviger til scenario |
| `navigateToFirstSykmelding(type, variant)` | `utils/user-actions` | Åpne første sykmelding i liste |

**Negasjoner** (`not.toBeVisible()`) skrives med `expect` direkte og ved å hente locatoren selv. `harSynligOverskrift` og `harSynligTekst` returnerer nok locatoren, men kaller `expect(locator).toBeVisible()` internt — testen vil feile der før du rekker å bruke `.not`.

```ts
// ✅ Riktig for negasjon
await expect(page.getByRole('heading', { name: 'Hva skjer videre?', level: 2 })).not.toBeVisible()

// ❌ Vil feile inne i hjelpefunksjonen
const locator = await harSynligOverskrift(page, 'Hva skjer videre?', 2) // kaster her
await expect(locator).not.toBeVisible()
```

**Tilgjengelige scenario-parametre i `gotoScenario()`:**
- `erUtenforVentetid: boolean` — styrer ventetid-svar fra mock-backend
- `antallArbeidsgivere: 0 | 1 | 2 | 3 | 4`
- `erForsteSykmelding: boolean`

**Eksempel:**
```ts
import { expect, test } from '../utils/fixtures'
import { gotoScenario } from '../utils/user-actions'
import { apneReadmore, harSynligOverskrift, harSynligTekst } from '../utils/test-utils'
import { validerAxe } from '../utils/uuvalidering'

test('viser riktig innhold', async ({ page }, testInfo) => {
    await gotoScenario('bekreftetFrilanser', { erUtenforVentetid: false })(page)
    await page.getByRole('region', { name: /Tidligere sykmeldinger/i }).getByRole('link').first().click()

    await harSynligOverskrift(page, 'Hva skjer videre?', 2)
    await harSynligTekst(page, 'Hvis du er syk i mindre enn 16 dager')
    await apneReadmore(page, 'Om din rett til å søke om sykepenger', ['Det er Nav som avgjør'])

    await validerAxe(page, testInfo)
})
```

### Kjøre tester lokalt
```bash
npx playwright test                      # alle tester (Chrome)
npx playwright test playwright/sykmelding  # kun sykmelding-tester
npx playwright test --ui                 # interaktiv UI-modus
```

## Git-commits

Commit-meldinger skal være **korte og beskrivende** på norsk eller engelsk — uten konvensjonelle prefikser som `feat:`, `fix:`, `chore:` o.l.

```bash
# ✅ Riktig
git commit -m "Vis opt-in info kun for sykmeldinger innenfor ventetiden"
git commit -m "Legg til Playwright-tester for ventetid-filtrering"

# ❌ Feil
git commit -m "feat: vis opt-in info kun for sykmeldinger innenfor ventetiden"
git commit -m "fix: bruk fixtures-import for expect"
```

## Viktige mønstre

### Mock-backend
Mock-data styres via URL-parametre (scenario, erUtenforVentetid, etc.) og håndteres i:
- `src/data/mock/mock-db/scenarios.ts` — scenarioliste
- `src/data/mock/mock-db/MockDb.ts` — tilstandsmaskin for mock
- `src/auth/mock-context.ts` — parser URL-parametre og setter tilstand

### React Query hooks
Hooks for API-kall ligger i `src/hooks/sykmelding/`. Bruk `enabled`-parameteren for å unngå unødige kall.

### Betinget rendering basert på ventetid
Bruk `useErUtenforVentetid(sykmeldingId, enabled)` og sjekk `data?.erUtenforVentetid === false` for å vise innhold kun innenfor ventetiden.
