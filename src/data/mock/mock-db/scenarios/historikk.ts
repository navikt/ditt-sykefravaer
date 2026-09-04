import { Periodetype, RegelStatus, StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { SykmeldingBuilder } from '../data-creators'
import { ScenarioCreator } from '../scenario-types'

export const allTypeSykmeldingBortsettFraNy: ScenarioCreator = () => ({
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

export const unsentWithPreviousSent: ScenarioCreator = () => ({
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

export const apenMenGammelSykmelding: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(-400).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

export const mangeGamleSykmeldinger: ScenarioCreator = () => {
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

export const kvitteringScenario: ScenarioCreator = () => ({
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
