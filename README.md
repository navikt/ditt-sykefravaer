# ditt-sykefravaer

Modernisert ditt sykefravær landingsside. Under arbeid

Lever under:
-   prod-gcp: https://www.nav.no/syk/sykefravaer
-   dev-gcp: https://www-gcp.dev.nav.no/syk/sykefravaer
-   labs-gcp (demo): https://ditt-sykefravaer.labs.nais.io/syk/sykefravaer/

## Kjør lokalt uten backend
```bash
npm run start-mock
```

## Kjør lokalt i docker-compose
Endre image i flex-docker-compose fra: 
```
image: "docker.pkg.github.com/navikt/ditt-sykefravaer/ditt-sykefravaer:latest"
``` 
Til: 
```
image: "ditt-sykefravaer:latest"
```
Bygg og tag nytt image ved å kjøre:
```bash
./buildlatest.sh
```

## Enhetstester
```bash
npm run test
```

## Cypress tester
```bash
npm run e2e
```

# Kontakt oss

Kanalen flex på slack
