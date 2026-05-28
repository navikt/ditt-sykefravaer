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
2. Importer fixtures fra `playwright/utils/fixtures` (ikke direkte fra `@playwright/test`)
3. Bruk `gotoScenario()` fra `playwright/utils/user-actions` for å sette opp tilstand
4. Bruk `navigateToFirstSykmelding()` der du trenger å åpne en spesifikk sykmelding
5. Opprett nye scenarios i `src/data/mock/mock-db/scenarios.ts` ved behov
6. Utvid `SykmeldingBuilder` i `src/data/mock/mock-db/data-creators.ts` om testdataen mangler

**Tilgjengelige scenario-parametre i `gotoScenario()`:**
- `erUtenforVentetid: boolean` — styrer ventetid-svar fra mock-backend
- `antallArbeidsgivere: 0 | 1 | 2 | 3 | 4`
- `erForsteSykmelding: boolean`

**Eksempel:**
```ts
import { gotoScenario } from '../utils/user-actions'
import { test } from '../utils/fixtures'
import { expect } from '@playwright/test'

test('viser riktig innhold', async ({ page }) => {
    await gotoScenario('bekreftetFrilanser', { erUtenforVentetid: false })(page)
    await expect(page.getByRole('heading', { name: 'Hva skjer videre?' })).toBeVisible()
})
```

### Kjøre tester lokalt
```bash
npx playwright test                      # alle tester (Chrome)
npx playwright test playwright/sykmelding  # kun sykmelding-tester
npx playwright test --ui                 # interaktiv UI-modus
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
