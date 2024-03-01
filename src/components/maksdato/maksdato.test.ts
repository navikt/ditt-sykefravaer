import { expect } from '@jest/globals'
import dayjs from 'dayjs'

import { Sykmelding } from '../../types/sykmelding'

import { skalViseMaksDato } from './skalViseMaksDato'

const iDag = dayjs().format('YYYY-MM-DD')
const femDagerSiden = dayjs().subtract(5, 'days').format('YYYY-MM-DD')
const attenDagerSiden = dayjs().subtract(18, 'days').format('YYYY-MM-DD')
const sekstiDagerSiden = dayjs().subtract(61, 'days').format('YYYY-MM-DD')
const sekstiEnDagerSiden = dayjs().subtract(61, 'days').format('YYYY-MM-DD')
const syttiEnDagerSiden = dayjs().subtract(61, 'days').format('YYYY-MM-DD')

const aktuellSykmelding: Sykmelding[] = [
    {
        id: '1',
        sykmeldingStatus: {
            statusEvent: 'SENDT',
        },
        behandlingsutfall: {
            status: 'OK',
        },
        sykmeldingsperioder: [
            {
                fom: iDag,
                tom: femDagerSiden,
            },
        ],
    },
]

const ikkeAktuellSykmelding: Sykmelding[] = [
    {
        id: '2',
        sykmeldingStatus: {
            statusEvent: 'SENDT',
        },
        behandlingsutfall: {
            status: 'OK',
        },
        sykmeldingsperioder: [
            {
                fom: attenDagerSiden,
                tom: attenDagerSiden,
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

it('returnerer false når det er sykmeldinger, men maksdatoen er mer enn 60 dager siden', () => {
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

it('returnerer true når maksdatoen er nøyaktig 60 dager siden', () => {
    const maxdate = { utbetaltTom: sekstiDagerSiden, maxDate: iDag }
    expect(skalViseMaksDato(aktuellSykmelding, maxdate)).toEqual(true)
})

it('returnerer false når maksdatoen er mer enn 60 dager siden', () => {
    const maxdate = { utbetaltTom: sekstiEnDagerSiden, maxDate: iDag }
    expect(skalViseMaksDato(aktuellSykmelding, maxdate)).toEqual(false)
})

it('returnerer false når det ikke finnes sykmeldinger', () => {
    const maxdate = { utbetaltTom: iDag, maxDate: iDag }
    expect(skalViseMaksDato([], maxdate)).toEqual(false)
})

it('returnerer true når minst en sykmelding er innafor 17 dagers grensen', () => {
    const maxdate = { utbetaltTom: iDag, maxDate: iDag }
    expect(skalViseMaksDato([...aktuellSykmelding, ...ikkeAktuellSykmelding], maxdate)).toEqual(true)
})
