import { RegelStatus, StatusEvent } from '../../../../types/sykmelding/sykmelding'

import { SykmeldingBuilder } from '../data-creators'
import { ScenarioCreator } from '../scenario-types'

export const normal: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(7, 'id-apen-sykmelding')
            .status(StatusEvent.APEN)
            .enkelPeriode({ offset: 0, days: 7 })
            .build(),
        new SykmeldingBuilder(-45, '2').send().enkelPeriode({ offset: 0, days: 7 }).build(),
        new SykmeldingBuilder(-65, '3').send().enkelPeriode({ offset: 0, days: 14 }).build(),
    ],
})

export const kunNy: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(20).status(StatusEvent.APEN).enkelPeriode({ offset: 0, days: 7 }).build()],
})

export const nyeSykmeldinger: ScenarioCreator = () => ({
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

export const emptyState: ScenarioCreator = () => ({
    sykmeldinger: [],
})
