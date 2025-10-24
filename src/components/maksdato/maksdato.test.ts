import { expect, it } from 'vitest'
import dayjs from 'dayjs'

import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { RegelStatus, StatusEvent } from '../../types/sykmelding/sykmelding'

import { skalViseMaksDato } from './skalViseMaksDato'

const iDag = dayjs().format('YYYY-MM-DD')
const femDagerSiden = dayjs().subtract(5, 'days').format('YYYY-MM-DD')
const syttenDagerSiden = dayjs().subtract(17, 'days').format('YYYY-MM-DD')
const femtini = dayjs().subtract(59, 'days').format('YYYY-MM-DD')
const sekstiDagerSiden = dayjs().subtract(60, 'days').format('YYYY-MM-DD')

const aktuellSykmelding: DittSykefravaerSykmelding[] = [
    {
        id: '1',
        sykmeldingStatus: {
            statusEvent: StatusEvent.SENDT,
        },
        behandlingsutfall: {
            status: RegelStatus.OK,
        },
        sykmeldingsperioder: [
            {
                fom: iDag,
                tom: femDagerSiden,
            },
        ],
    },
]

const ikkeAktuellSykmelding: DittSykefravaerSykmelding[] = [
    {
        id: '2',
        sykmeldingStatus: {
            statusEvent: StatusEvent.SENDT,
        },
        behandlingsutfall: {
            status: RegelStatus.OK,
        },
        sykmeldingsperioder: [
            {
                fom: syttenDagerSiden,
                tom: syttenDagerSiden,
            },
        ],
    },
]

it('returnerer true når det er aktuell sykmelding, og maksdatoen er innenfor 60 dager', () => {
    const maxdate = { utbetaltTom: femDagerSiden, maxDate: iDag }
    expect(skalViseMaksDato(aktuellSykmelding, maxdate)).toEqual(true)
})

it('returnerer false når det ikke er aktuell sykmelding, og maksdatoen er innenfor 60 dager', () => {
    const maxdate = { utbetaltTom: femDagerSiden, maxDate: iDag }
    expect(skalViseMaksDato(ikkeAktuellSykmelding, maxdate)).toEqual(false)
})

it('returnerer true når det er sykmeldinger, men maksdatoen er 59 dager siden', () => {
    const maxdate = { utbetaltTom: femtini, maxDate: iDag }
    expect(skalViseMaksDato(aktuellSykmelding, maxdate)).toEqual(true)
})

it('returnerer false når det er sykmeldinger, men maksdatoen er 60 dager siden', () => {
    const maxdate = { utbetaltTom: sekstiDagerSiden, maxDate: iDag }
    expect(skalViseMaksDato(aktuellSykmelding, maxdate)).toEqual(false)
})

it('returnerer false når det ikke er noen maksdato', () => {
    const maxdate = undefined
    expect(skalViseMaksDato(aktuellSykmelding, maxdate)).toEqual(false)
})

it('returnerer false når det er sykmeldinger som ikke er innafor', () => {
    const maxdate = { utbetaltTom: femDagerSiden, maxDate: iDag }
    expect(skalViseMaksDato(ikkeAktuellSykmelding, maxdate)).toEqual(false)
})

it('returnerer false når det ikke finnes sykmeldinger', () => {
    const maxdate = { utbetaltTom: iDag, maxDate: iDag }
    expect(skalViseMaksDato([], maxdate)).toEqual(false)
})

it('returnerer true når minst en sykmelding er innafor 17 dagers grensen', () => {
    const maxdate = { utbetaltTom: iDag, maxDate: iDag }
    expect(skalViseMaksDato([...aktuellSykmelding, ...ikkeAktuellSykmelding], maxdate)).toEqual(true)
})
