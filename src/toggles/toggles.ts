export type ExpectedToggles = (typeof EXPECTED_TOGGLES)[number]
export const EXPECTED_TOGGLES = [
    'flexjar-ditt-sykefravaer-fant-du',
    'ditt-sykefravaer-maxdato',
    'flexjar-ditt-sykefravaer-inntektsmelding-visning',
    'flexjar-sykmelding-kvittering',
    'ditt-sykefravaer-sykmelding-gradvis-utrulling',
] as const
