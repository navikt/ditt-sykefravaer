# ditt-sykefravaer

Ditt sykefravær landingsside.

Lever under:
-   prod-gcp: https://www.nav.no/syk/sykefravaer
-   dev-gcp: https://www-gcp.dev.nav.no/syk/sykefravaer
-   labs-gcp: https://ditt-sykefravaer.labs.nais.io/syk/sykefravaer/

## Tilgang til Github Package Registry

Siden vi bruker avhengigheter som ligger i GPR, så må man sette opp tilgang til GPR med en PAT (personal access token) som har `read:packages`. Du kan [opprette PAT her](https://github.com/settings/tokens). Dersom du har en PAT som du bruker for tilgang til maven-packages i github kan du gjenbruke denne.

I din `.bashrc` eller `.zshrc`, sett følgende miljøvariabel:

`export NPM_AUTH_TOKEN=<din PAT med read:packages>`

## Kjør lokalt uten backend
```bash
npm run dev
```

## Enhetstester
```bash
npm run test
```

## Cypress tester
```bash
npm run e2e
```

## Dette logges i Amplitude

Alle oppgaver/varsler:

Teksten på oppgave/varsel logges kun dersom dette ikke inneholder meldingstype.

- Nye og avviste sykmeldinger
- Nye søknader
- Svar på søknader
- Nye oppfølgingsplan
- Aktivitetsplan
- Innkalling til dialøgmøte
- Oppgave/varsel som lukkes
- Navigering ut av siden gjennom den spesifikke oppgaven

Navigasjon ut fra ditt-sykefravær til:

- Sykmeldinger
- Søknader
- Svar på søknader
- Aktivitetsplan
- Oppfølgingsplaner
- Dialogmøter


# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles til flex@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #flex.
