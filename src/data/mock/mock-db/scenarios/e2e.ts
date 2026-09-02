import { Periodetype, StatusEvent } from '../../../../types/sykmelding/sykmelding'
import { ArbeidssituasjonType } from '../../../../types/sykmelding/sykmeldingCommon'

import { SykmeldingBuilder } from '../data-creators'
import { ScenarioCreator } from '../scenario-types'

export const unsentButtAgainstNormal: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-14).enkelPeriode({ offset: 0, days: 7 }).send().build(),
        new SykmeldingBuilder(-7).enkelPeriode({ offset: 1, days: 7 }).status(StatusEvent.APEN).build(),
    ],
})

export const buttAgainstAvventende: ScenarioCreator = () => ({
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
})

export const buttAgainstAvventendeSent: ScenarioCreator = () => ({
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
})

export const buttAgainstGradert: ScenarioCreator = () => ({
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
})

export const noBrukerSvar: ScenarioCreator = () => ({
    sykmeldinger: [new SykmeldingBuilder(-14).enkelPeriode({ offset: 0, days: 7 }).send().noBrukerSvar().build()],
})

export const enSentEnBekreftet: ScenarioCreator = () => ({
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
})

export const bekreftetFrilanser: ScenarioCreator = () => ({
    sykmeldinger: [
        new SykmeldingBuilder(-14, 'id-bekreftet-frilanser')
            .bekreft(ArbeidssituasjonType.FRILANSER)
            .enkelPeriode({ offset: 0, days: 10 })
            .build(),
    ],
})
