import { Scenario, ScenarioCreator } from './scenario-types'
import { emptyState, kunNy, normal, nyeSykmeldinger } from './scenarios/grunnleggende'
import { avventene, behandlingsdager, flerePerioder, gradertPeriode, reisetilskudd } from './scenarios/periodetyper'
import {
    avbrutt,
    avbruttEgenmelding,
    avvistData,
    avvistTilbakedateringer,
    delvisGodkjentTilbakedatering,
    egenmeldt,
    harUnderBehandling,
    harUnderBehandlingUsent,
    overSytti,
    papirSykmelding,
    tilbakedateringKreverMerInfo,
    ugyldigTilbakedatering,
    under20Prosent,
    utenlandsk,
    utgatt,
} from './scenarios/status-og-unntak'
import {
    allTypeSykmeldingBortsettFraNy,
    apenMenGammelSykmelding,
    kvitteringScenario,
    mangeGamleSykmeldinger,
    unsentWithPreviousSent,
} from './scenarios/historikk'
import { brukerinfoFeil, feilmelding, sykmeldingFeilEtterNavigasjon } from './scenarios/tekniske'
import {
    bekreftetFrilanser,
    buttAgainstAvventende,
    buttAgainstAvventendeSent,
    buttAgainstGradert,
    enSentEnBekreftet,
    noBrukerSvar,
    unsentButtAgainstNormal,
} from './scenarios/e2e'

export type { Scenario, ScenarioCreator }

const scenarioGrunnleggende = {
    normal: {
        description: 'En ny og et par innsendte (standard)',
        scenario: normal,
    },
    kunNy: {
        description: 'Kun èn ny sykmelding',
        scenario: kunNy,
    },
    nyeSykmeldinger: {
        description: 'Kun nye sykmeldinger',
        scenario: nyeSykmeldinger,
    },
    ingenSykmeldinger: {
        description: 'Ingen sykmeldinger',
        scenario: emptyState,
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

const scenarioPeriodetyper = {
    gradertPeriode: {
        description: 'En åpen sykmelding med gradert periode',
        scenario: gradertPeriode,
    },
    behandlingsdager: {
        description: 'En åpen sykmelding med behandlingsdager',
        scenario: behandlingsdager,
    },
    avventene: {
        description: 'En åpen sykmelding med avventende periode',
        scenario: avventene,
    },
    reisetilskudd: {
        description: 'En åpen sykmelding med reisetilskudd',
        scenario: reisetilskudd,
    },
    flerePerioder: {
        description: 'En sykmelding med flere perioder',
        scenario: flerePerioder,
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

const scenarioStatusOgUnntak = {
    papirsykmelding: {
        description: 'En ny og en gammel papirsykmelding',
        scenario: papirSykmelding,
    },
    utenlandsk: {
        description: 'Utenlanske sykmeldinger',
        scenario: utenlandsk,
    },
    egenmeldt: {
        description: 'Egenmeldt sykmelding',
        scenario: egenmeldt,
    },
    avbrutt: {
        description: 'Èn avbrutt sykmelding',
        scenario: avbrutt,
    },
    avbruttEgenmelding: {
        description: 'Èn avbrutt egenmelding',
        scenario: avbruttEgenmelding,
    },
    overSytti: {
        description: 'En ny sykmelding, sykmeldt er over 70',
        scenario: overSytti,
    },
    harUnderBehandlingUsent: {
        description: 'Har en ny under (manuell) behandling',
        scenario: harUnderBehandlingUsent,
    },
    harUnderBehandling: {
        description: 'Har en innsendt under (manuell) behandling',
        scenario: harUnderBehandling,
    },
    avvist: {
        description: 'Avviste sykmeldinger grunnet tilbakedatering (med bekreftet)',
        scenario: avvistTilbakedateringer,
    },
    avvistData: {
        description: 'Avvist grunnet ugyldig data',
        scenario: avvistData,
    },
    under20Prosent: {
        description: 'Papirsykmelding med grad under 20%',
        scenario: under20Prosent,
    },
    ugyldigTilbakedatering: {
        description: 'Sykmelding med ugyldig tilbakedatering og er til manuell behandling',
        scenario: ugyldigTilbakedatering,
    },
    delvisGodkjentTilbakedatering: {
        description: 'Delvis godkjent tilbakedatering og er til manuell behandling',
        scenario: delvisGodkjentTilbakedatering,
    },
    tilbakedateringKreverMerInfo: {
        description: 'Tilbakedatering som krever flere opplysninger',
        scenario: tilbakedateringKreverMerInfo,
    },
    utgatt: {
        description: 'Utgått sykmelding',
        scenario: utgatt,
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

const scenarioHistorikkOgKvittering = {
    allTypeSykmelding: {
        description: 'Alle typer sykmelding bortsett fra ny',
        scenario: allTypeSykmeldingBortsettFraNy,
    },
    usendtMedTidligereSent: {
        description: 'Usendt med en tidligere sendt',
        scenario: unsentWithPreviousSent,
    },
    apenMenGammelSykmelding: {
        description: 'Åpen men gammel sykmelding',
        scenario: apenMenGammelSykmelding,
    },
    mangeGamleSykmeldinger: {
        description: 'Mange gamle sykmeldinger',
        scenario: mangeGamleSykmeldinger,
    },
    kvittering: {
        description: 'Info i kvittering',
        scenario: kvitteringScenario,
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

export const synligeScenarioGrupper = {
    grunnleggende: scenarioGrunnleggende,
    periodetyper: scenarioPeriodetyper,
    statusOgUnntak: scenarioStatusOgUnntak,
    historikkOgKvittering: scenarioHistorikkOgKvittering,
} as const

export const tekniskeScenarioer = {
    feilmelding: {
        description: 'Kaster 500 error',
        scenario: feilmelding,
    },
    sykmeldingFeil: {
        description: 'Feil ved åpnet sykmelding',
        scenario: sykmeldingFeilEtterNavigasjon,
    },
    brukerinformasjonFeil: {
        description: 'Feil ved brukerinfo',
        scenario: brukerinfoFeil,
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

export const skjulteE2eScenarioer = {
    unsentButtAgainstNormal: {
        description: 'En usendt sykmelding kant i kant med en tidligere sykmelding',
        scenario: unsentButtAgainstNormal,
    },
    buttAgainstAvventende: {
        description: 'En sendt sykmelding kant i kant med en tidligere sykmelding med AVVENTENDE periode',
        scenario: buttAgainstAvventende,
    },
    buttAgainstAvventendeSent: {
        description: 'En sendt sykmelding kant i kant med en tidligere sykmelding med AVVENTENDE periode',
        scenario: buttAgainstAvventendeSent,
    },
    buttAgainstGradert: {
        description: 'En sendte sykmelding kant i kant med en tidligere sykmelding med gradert periode',
        scenario: buttAgainstGradert,
    },
    noBrukerSvar: {
        description: 'En sykmelding som ble sendt inn før vi lagret brukersvar i databasen',
        scenario: noBrukerSvar,
    },
    enSentEnBekreftet: {
        description: 'En sendt og en bekreftet',
        scenario: enSentEnBekreftet,
    },
    bekreftetFrilanser: {
        description: 'En bekreftet sykmelding for frilanser (brukes for ventetid-tester)',
        scenario: bekreftetFrilanser,
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

export const e2eScenarios = skjulteE2eScenarioer

export type Scenarios =
    | keyof typeof scenarioGrunnleggende
    | keyof typeof scenarioPeriodetyper
    | keyof typeof scenarioStatusOgUnntak
    | keyof typeof scenarioHistorikkOgKvittering
    | keyof typeof tekniskeScenarioer
    | keyof typeof skjulteE2eScenarioer

export const scenarios = {
    ...scenarioGrunnleggende,
    ...scenarioPeriodetyper,
    ...scenarioStatusOgUnntak,
    ...scenarioHistorikkOgKvittering,
    ...tekniskeScenarioer,
    ...skjulteE2eScenarioer,
}

export function isValidScenario(scenario: string | null | undefined): scenario is Scenarios {
    if (scenario == null) return false

    return Object.keys(scenarios).includes(scenario)
}
