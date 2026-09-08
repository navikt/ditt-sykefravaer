import { Merknadtype, Periodetype, RegelStatus, StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { SykmeldingBuilder } from '../data-creators'
import { ScenarioCreator } from '../scenario-types'

import { normal } from './grunnleggende'

export const papirSykmelding: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7).enkelPeriode().papir().status(StatusEvent.APEN).build(),
        new SykmeldingBuilder(7).enkelPeriode().papir().send().build(),
    ],
})

export const utenlandsk: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7).enkelPeriode().utenlandsk().status(StatusEvent.APEN).build(),
        new SykmeldingBuilder(14).enkelPeriode().utenlandsk().papir().status(StatusEvent.APEN).build(),
        new SykmeldingBuilder(21).enkelPeriode().utenlandsk().papir().send().build(),
        new SykmeldingBuilder(29).enkelPeriode().utenlandsk().send().build(),
    ],
})

export const egenmeldt: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).enkelPeriode().status(StatusEvent.APEN).egenmeldt().build()],
})

export const avbrutt: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).enkelPeriode().status(StatusEvent.AVBRUTT).build()],
})

export const avbruttEgenmelding: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).egenmeldt().enkelPeriode().status(StatusEvent.AVBRUTT).build()],
})

export const overSytti: ScenarioCreator = () => ({
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

export const harUnderBehandlingUsent: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7)
            .enkelPeriode({ offset: 0, days: 7 })
            .merknader([{ type: Merknadtype.UNDER_BEHANDLING, beskrivelse: null }])
            .build(),
    ],
})

export const harUnderBehandling: ScenarioCreator = () => ({
    sykmeldinger: [
        ...(normal().sykmeldinger ?? []),
        new SykmeldingBuilder(7)
            .send()
            .enkelPeriode({ offset: 0, days: 7 })
            .merknader([{ type: Merknadtype.UNDER_BEHANDLING, beskrivelse: null }])
            .behandlingsutfall(RegelStatus.OK, [], true)
            .build(),
    ],
})

export const avvistTilbakedateringer: ScenarioCreator = () => ({
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

export const avvistData: ScenarioCreator = () => ({
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

export const under20Prosent: ScenarioCreator = () => ({
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

export const ugyldigTilbakedatering: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .merknader([{ type: Merknadtype.UGYLDIG_TILBAKEDATERING, beskrivelse: null }])
            .build(),
    ],
})

export const delvisGodkjentTilbakedatering: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .merknader([{ type: Merknadtype.DELVIS_GODKJENT, beskrivelse: null }])
            .build(),
    ],
})

export const tilbakedateringKreverMerInfo: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-7)
            .enkelPeriode()
            .status(StatusEvent.APEN)
            .merknader([{ type: Merknadtype.TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER, beskrivelse: null }])
            .build(),
    ],
})

export const utgatt: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(7).enkelPeriode().status(StatusEvent.UTGATT).build()],
})
