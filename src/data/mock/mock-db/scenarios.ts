import { Merknadtype, Periodetype, RegelStatus, StatusEvent } from '../../../types/sykmelding/sykmelding'
import { MuterbarSykmelding } from '../../../server/api-models/sykmelding/MuterbarSykmelding'

import { SykmeldingBuilder } from './data-creators'

type ScenarioCreator = () => Scenario

export type Scenario = {
    sykmeldinger: MuterbarSykmelding[]
    error?: { message: string }
}

const normal: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7, 'id-apen-sykmelding')
            .status(StatusEvent.APEN)
            .enkelPeriode({ offset: 0, days: 7 })
            .build(),
        new SykmeldingBuilder(-45, '2').send().enkelPeriode({ offset: 0, days: 7 }).build(),
        new SykmeldingBuilder(-65, '3').send().enkelPeriode({ offset: 0, days: 14 }).build(),
    ],
})

const kunNy: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(20).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

const sykmeldingFeilEtterNavigasjon: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

const brukerinfoFeil: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

const unsentWithPreviousSent: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-30) // En sendt sykmelding fra 30 dager siden
            .status(StatusEvent.APEN)
            .enkelPeriode({ offset: 0, days: 7 })
            .build(),
        new SykmeldingBuilder(-2) // En åpen sykmelding fra 2 dager siden
            .status(StatusEvent.APEN)
            .enkelPeriode({ offset: 0, days: 7 })
            .build(),
    ],
})

const gradertPeriode: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .status(StatusEvent.APEN)
            .relativePeriode(
                {
                    type: Periodetype.GRADERT,
                    gradert: {
                        grad: 60,
                        reisetilskudd: false,
                    },
                },
                { offset: 0, days: 14 },
            )
            .build(),
    ],
})

const emptyState: ScenarioCreator = () => ({
    sykmeldinger: [],
})

const feilmelding: ScenarioCreator = () => ({
    sykmeldinger: [],
})

const allTypeSykmeldingBortsettFraNy: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7).status(StatusEvent.UTGATT).enkelPeriode({ offset: 0, days: 7 }).build(),
        new SykmeldingBuilder(7).status(StatusEvent.AVBRUTT).enkelPeriode({ offset: 0, days: 7 }).build(),
        new SykmeldingBuilder(7).bekreft().enkelPeriode({ offset: 0, days: 7 }).build(),
        new SykmeldingBuilder(7)
            .behandlingsutfall(RegelStatus.INVALID, [
                {
                    messageForSender:
                        'Sykmeldingen er tilbakedatert uten tilstrekkelig begrunnelse fra den som sykmeldte deg.',
                    messageForUser:
                        'Sykmeldingen er tilbakedatert uten tilstrekkelig begrunnelse fra den som sykmeldte deg.',
                    ruleName: 'INNTIL_8_DAGER',
                    ruleStatus: RegelStatus.INVALID,
                },
            ])
            .bekreft()
            .enkelPeriode({ offset: 0, days: 7 })
            .build(),
        new SykmeldingBuilder(-45).send().enkelPeriode({ offset: 0, days: 7 }).build(),
    ],
})

const nyeSykmeldinger: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-2).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build(),
        new SykmeldingBuilder(-6).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).papir().build(),
        new SykmeldingBuilder(-4)
            .status(StatusEvent.APEN)
            .enkelPeriode({ offset: 0, days: 7 })
            .behandlingsutfall(RegelStatus.INVALID, [
                {
                    messageForSender:
                        'Sykmeldingen kan ikke rettes, det må skrives en ny. Pasienten har fått beskjed om å vente på ny sykmelding fra deg. Grunnet følgende: Første sykmelding er tilbakedatert uten at begrunnelse (felt 11.2) er tilstrekkelig utfylt',
                    messageForUser:
                        'Sykmeldingen er tilbakedatert uten tilstrekkelig begrunnelse fra den som sykmeldte deg.',
                    ruleName: 'INNTIL_8_DAGER',
                    ruleStatus: RegelStatus.INVALID,
                },
            ])
            .build(),
    ],
})

const kvitteringScenario: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-45)
            .send()
            .relativePeriode(
                {
                    type: Periodetype.AKTIVITET_IKKE_MULIG,
                    medisinskArsak: null,
                    arbeidsrelatertArsak: null,
                },
                { offset: 0, days: 14 },
            )
            .build(),
        new SykmeldingBuilder(-14)
            .bekreft()
            .relativePeriode(
                {
                    type: Periodetype.AKTIVITET_IKKE_MULIG,
                    medisinskArsak: null,
                    arbeidsrelatertArsak: null,
                },
                { offset: 0, days: 14 },
            )
            .build(),
    ],
})

const apenMenGammelSykmelding: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(-365).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

const papirSykmelding: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7).enkelPeriode().papir().status(StatusEvent.APEN).build(),
        new SykmeldingBuilder(7).enkelPeriode().papir().send().build(),
    ],
})

const utenlandsk: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7).enkelPeriode().utenlandsk().status(StatusEvent.APEN).build(),
        new SykmeldingBuilder(14).enkelPeriode().utenlandsk().papir().status(StatusEvent.APEN).build(),
        new SykmeldingBuilder(21).enkelPeriode().utenlandsk().papir().send().build(),
        new SykmeldingBuilder(29).enkelPeriode().utenlandsk().send().build(),
    ],
})

const overSytti: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .enkelPeriode()
            .pasient({
                fnr: '88888823456',
                fornavn: 'Fransisca',
                mellomnavn: null,
                etternavn: 'Frost',
                overSyttiAar: true,
            })
            .status(StatusEvent.APEN)
            .build(),
    ],
})

const avbrutt: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).enkelPeriode().status(StatusEvent.AVBRUTT).build()],
})

const avbruttEgenmelding: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).egenmeldt().enkelPeriode().status(StatusEvent.AVBRUTT).build()],
})

const avvistTilbakedateringer: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .behandlingsutfall(RegelStatus.INVALID, [
                {
                    messageForSender:
                        'Sykmeldingen kan ikke rettes, det må skrives en ny. Pasienten har fått beskjed om å vente på ny sykmelding fra deg. Grunnet følgende: Første sykmelding er tilbakedatert uten at begrunnelse (felt 11.2) er tilstrekkelig utfylt',
                    messageForUser:
                        'Sykmeldingen er tilbakedatert uten tilstrekkelig begrunnelse fra den som sykmeldte deg.',
                    ruleName: 'INNTIL_8_DAGER',
                    ruleStatus: RegelStatus.INVALID,
                },
            ])
            .build(),
        new SykmeldingBuilder(7)
            .enkelPeriode()
            .bekreft()
            .behandlingsutfall(RegelStatus.INVALID, [
                {
                    messageForSender:
                        'Sykmeldingen kan ikke rettes, det må skrives en ny. Pasienten har fått beskjed om å vente på ny sykmelding fra deg. Grunnet følgende: Sykmelding er tilbakedatert uten begrunnelse (felt 11.2) er tilstrekkelig utfylt',
                    messageForUser:
                        'Sykmeldingen er tilbakedatert uten tilstrekkelig begrunnelse fra den som sykmeldte deg.',
                    ruleName: 'INNTIL_1_MAANDE',
                    ruleStatus: RegelStatus.INVALID,
                },
            ])
            .build(),
    ],
})

const ugyldigTilbakedatering: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .merknader([{ type: Merknadtype.UGYLDIG_TILBAKEDATERING, beskrivelse: null }])
            .build(),
    ],
})

const delvisGodkjentTilbakedatering: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .merknader([{ type: Merknadtype.DELVIS_GODKJENT, beskrivelse: null }])
            .build(),
    ],
})

const tilbakedateringKreverMerInfo: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .merknader([{ type: Merknadtype.TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER, beskrivelse: null }])
            .build(),
    ],
})

const utgatt: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).enkelPeriode().status(StatusEvent.UTGATT).build()],
})

const avvistData: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .behandlingsutfall(RegelStatus.INVALID, [
                {
                    messageForSender:
                        'Sykmeldingen kan ikke rettes, det må skrives en ny. Pasienten har fått beskjed om å vente på ny sykmelding fra deg. Grunnet følgende:Hvis sykmeldingsgrad er høyere enn 99% for delvis sykmelding avvises meldingen',
                    messageForUser: 'Sykmeldingsgraden kan ikke være mer enn 99% fordi det er en gradert sykmelding.',
                    ruleName: 'GRADERT_SYKMELDING_OVER_99_PROSENT',
                    ruleStatus: RegelStatus.INVALID,
                },
            ])
            .build(),
    ],
})

const under20Prosent: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .relativePeriode(
                {
                    type: Periodetype.GRADERT,
                    gradert: {
                        grad: 14,
                        reisetilskudd: false,
                    },
                },
                { offset: 0, days: 14 },
            )
            .status(StatusEvent.APEN)
            .papir()
            .build(),
    ],
})

const egenmeldt: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).enkelPeriode().status(StatusEvent.APEN).egenmeldt().build()],
})

const behandlingsdager: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .relativePeriode({ type: Periodetype.BEHANDLINGSDAGER, behandlingsdager: 1 }, { offset: 0, days: 1 })
            .status(StatusEvent.APEN)
            .build(),
    ],
})

const avventene: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .relativePeriode(
                { type: Periodetype.AVVENTENDE, tilrettelegging: 'Bedre transport til jobb' },
                { offset: 0, days: 7 },
            )
            .status(StatusEvent.APEN)
            .egenmeldt()
            .build(),
    ],
})

const reisetilskudd: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .relativePeriode({ type: Periodetype.REISETILSKUDD }, { offset: 0, days: 7 })
            .status(StatusEvent.APEN)
            .egenmeldt()
            .build(),
    ],
})

const harUnderBehandling: ScenarioCreator = () => ({
    sykmeldinger: [
        ...(normal().sykmeldinger ?? []),
        new SykmeldingBuilder(7)
            .send()
            .enkelPeriode({ offset: 0, days: 7 })
            .merknader([{ type: Merknadtype.UNDER_BEHANDLING, beskrivelse: null }])
            .build(),
    ],
})

const harUnderBehandlingUsent: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .enkelPeriode({ offset: 0, days: 7 })
            .merknader([{ type: Merknadtype.UNDER_BEHANDLING, beskrivelse: null }])
            .build(),
    ],
})

const mangeGamleSykmeldinger: ScenarioCreator = () => {
    const basicSykmelding = (offset: number): SykmeldingBuilder =>
        new SykmeldingBuilder(offset).enkelPeriode({ offset: 0, days: 14 })

    return {
        sykmeldinger: [
            basicSykmelding(-31).bekreft().build(),
            basicSykmelding(-60).send().build(),
            basicSykmelding(-70).status(StatusEvent.AVBRUTT).build(),
            basicSykmelding(-90).status(StatusEvent.UTGATT).build(),
            basicSykmelding(-120).send().build(),
            basicSykmelding(-150).status(StatusEvent.AVBRUTT).build(),
            basicSykmelding(-170).send().build(),
            basicSykmelding(-190).send().build(),
            basicSykmelding(-210).send().build(),
            basicSykmelding(-365).send().build(),
            basicSykmelding(-390).send().build(),
            basicSykmelding(-1460).send().build(),
            basicSykmelding(-1825).send().build(),
            basicSykmelding(-2282).send().build(),
        ],
    }
}

const flerePerioder: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(0)
            .status(StatusEvent.APEN)
            .enkelPeriode({ offset: 0, days: 7 })
            .enkelPeriode({ offset: -7, days: 7 })
            .build(),
    ],
})

export type Scenarios = keyof typeof simpleScenarios | keyof typeof otherScenarios | keyof typeof e2eScenarios
export const simpleScenarios = {
    normal: {
        description: 'En ny og et par innsendte (standard)',
        scenario: normal,
    },
    kunNy: {
        description: 'Kun èn ny sykmelding',
        scenario: kunNy,
    },
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
    papirsykmelding: {
        description: 'En ny og en gammel papirsykmelding',
        scenario: papirSykmelding,
    },
    ingenSykmeldinger: {
        description: 'Ingen sykmeldinger',
        scenario: emptyState,
    },
    allTypeSykmelding: {
        description: 'Alle typer sykmelding bortsett fra ny',
        scenario: allTypeSykmeldingBortsettFraNy,
    },
    usendtMedTidligereSent: {
        description: 'Usendt med en tidligere sendt',
        scenario: unsentWithPreviousSent,
    },
    sykmeldingFeil: {
        description: 'Feil ved åpnet sykmelding',
        scenario: sykmeldingFeilEtterNavigasjon,
    },
    brukerinformasjonFeil: {
        description: 'Feil ved brukerinfo',
        scenario: brukerinfoFeil,
    },
    nyeSykmeldinger: {
        description: 'Kun nye sykmeldinger',
        scenario: nyeSykmeldinger,
    },
    apenMenGammelSykmelding: {
        description: 'Åpen men gammel sykmelding',
        scenario: apenMenGammelSykmelding,
    },
    feilmelding: {
        description: 'Kaster 500 error',
        scenario: feilmelding,
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

export const otherScenarios = {
    utenlandsk: {
        description: 'Utenlanske sykmeldinger',
        scenario: utenlandsk,
    },
    overSytti: {
        description: 'En ny sykmelding, sykmeldt er over 70',
        scenario: overSytti,
    },
    egenmeldt: {
        description: 'Egenmeldt sykmelding',
        scenario: egenmeldt,
    },
    mangeGamleSykmeldinger: {
        description: 'Mange gamle sykmeldinger',
        scenario: mangeGamleSykmeldinger,
    },
    flerePerioder: {
        description: 'En sykmelding med flere perioder',
        scenario: flerePerioder,
    },
    avbrutt: {
        description: 'Èn avbrutt sykmelding',
        scenario: avbrutt,
    },
    avbruttEgenmelding: {
        description: 'Èn avbrutt egenmelding',
        scenario: avbruttEgenmelding,
    },
    kvittering: {
        description: 'Info i kvittering',
        scenario: kvitteringScenario,
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

export const e2eScenarios = {
    unsentButtAgainstNormal: {
        description: 'En usendt sykmelding kant i kant med en tidligere sykmelding',
        scenario: () => ({
            sykmeldinger: [
                new SykmeldingBuilder(-14).enkelPeriode({ offset: 0, days: 7 }).send().build(),
                new SykmeldingBuilder(-7).enkelPeriode({ offset: 1, days: 7 }).status(StatusEvent.APEN).build(),
            ],
        }),
    },
    buttAgainstAvventende: {
        description: 'En sendt sykmelding kant i kant med en tidligere sykmelding med AVVENTENDE periode',
        scenario: () => ({
            sykmeldinger: [
                new SykmeldingBuilder(-14)
                    .relativePeriode(
                        {
                            type: Periodetype.AVVENTENDE,
                            tilrettelegging: 'Eksempel på tilrettelegging',
                        },
                        { offset: 0, days: 7 },
                    )
                    .send()
                    .build(),
                new SykmeldingBuilder(-7).enkelPeriode({ offset: 1, days: 7 }).status(StatusEvent.APEN).build(),
            ],
        }),
    },
    buttAgainstAvventendeSent: {
        description: 'En sendt sykmelding kant i kant med en tidligere sykmelding med AVVENTENDE periode',
        scenario: () => ({
            sykmeldinger: [
                new SykmeldingBuilder(-14)
                    .relativePeriode(
                        {
                            type: Periodetype.AVVENTENDE,
                            tilrettelegging: 'Eksempel på tilrettelegging',
                        },
                        { offset: 0, days: 7 },
                    )
                    .send()
                    .build(),
                new SykmeldingBuilder(-7).enkelPeriode({ offset: 1, days: 7 }).send().build(),
            ],
        }),
    },
    buttAgainstGradert: {
        description: 'En sendte sykmelding kant i kant med en tidligere sykmelding med gradert periode',
        scenario: () => ({
            sykmeldinger: [
                new SykmeldingBuilder(-14)
                    .relativePeriode(
                        {
                            type: Periodetype.GRADERT,
                            gradert: { grad: 60, reisetilskudd: false },
                        },
                        { offset: 0, days: 7 },
                    )
                    .send()
                    .build(),
                new SykmeldingBuilder(-7).enkelPeriode({ offset: 1, days: 7 }).send().build(),
            ],
        }),
    },
    noBrukerSvar: {
        description: 'En sykmelding som ble sendt inn før vi lagret brukersvar i databasen',
        scenario: () => ({
            sykmeldinger: [
                new SykmeldingBuilder(-14).enkelPeriode({ offset: 0, days: 7 }).send().noBrukerSvar().build(),
            ],
        }),
    },
    enSentEnBekreftet: {
        description: 'En sendt og en bekreftet',
        scenario: () => ({
            sykmeldinger: [
                new SykmeldingBuilder(-45)
                    .send()
                    .relativePeriode(
                        {
                            type: Periodetype.AKTIVITET_IKKE_MULIG,
                            medisinskArsak: null,
                            arbeidsrelatertArsak: null,
                        },
                        { offset: 0, days: 14 },
                    )
                    .build(),
                new SykmeldingBuilder(-14).bekreft().enkelPeriode({ offset: 0, days: 12 }).build(),
            ],
        }),
    },
} satisfies Record<string, { description: string; scenario: ScenarioCreator }>

export function isValidScenario(scenario: string | null | undefined): scenario is Scenarios {
    if (scenario == null) return false

    return Object.keys(scenarios).includes(scenario)
}

export const scenarios = { ...simpleScenarios, ...otherScenarios, ...e2eScenarios }
