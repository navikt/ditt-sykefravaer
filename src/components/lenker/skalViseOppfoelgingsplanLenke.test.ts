import { expect, it } from 'vitest'
import dayjs from 'dayjs'

import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { testDato } from '../../data/mock/mock-db/data-creators'

import { skalViseOppfoelgingsplanLenke } from './skalViseOppfoelgingsplanLenke'

it('Returnerer false hvis ingenting er fetchet', () => {
    const skalVise = skalViseOppfoelgingsplanLenke(undefined, undefined, testDato)
    expect(skalVise).toEqual(false)
})

it('Returnerer true hvis undefined sykmeldinger men oppfølgingsplaner', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skalVise = skalViseOppfoelgingsplanLenke(undefined, [{ id: 1 } as any], testDato)
    expect(skalVise).toEqual(true)
})

it('Returnerer false hvis undefined sykmeldinger og ingen oppfølgingsplaner', () => {
    const skalVise = skalViseOppfoelgingsplanLenke(undefined, [], testDato)
    expect(skalVise).toEqual(false)
})

it('Returnerer false hvis ingen sykmeldinger og ingen oppfølgingsplaner', () => {
    const skalVise = skalViseOppfoelgingsplanLenke([], [], testDato)
    expect(skalVise).toEqual(false)
})

it('Returnerer false hvis en gammel sykmelding og ingen oppfølgingsplaner', () => {
    const dagensDato = dayjs(testDato)
    const fireMaanederOgToDagerSiden = dagensDato.subtract(4, 'months').subtract(2, 'days').format('YYYY-MM-DD')
    const sykmelding: DittSykefravaerSykmelding = {
        id: 'APEN',
        sykmeldingStatus: {
            statusEvent: 'APEN',
            arbeidsgiver: { orgnummer: '1234', orgNavn: 'Jobben' },
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [{ fom: '2021-03-01', tom: fireMaanederOgToDagerSiden }],
    }
    const skalVise = skalViseOppfoelgingsplanLenke([sykmelding], [], testDato)
    expect(skalVise).toEqual(false)
})

it('Returnerer true hvis en nesten 4 måneder gammel sykmelding og ingen oppfølgingsplaner', () => {
    const dagensDato = dayjs(testDato)
    const nestenFireMaanederSiden = dagensDato.subtract(4, 'months').add(2, 'days').format('YYYY-MM-DD')
    const sykmelding: DittSykefravaerSykmelding = {
        id: 'APEN',
        sykmeldingStatus: {
            statusEvent: 'APEN',
            arbeidsgiver: { orgnummer: '1234', orgNavn: 'Jobben' },
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [{ fom: '2021-03-01', tom: nestenFireMaanederSiden }],
    }
    const skalVise = skalViseOppfoelgingsplanLenke([sykmelding], [], testDato)
    expect(skalVise).toEqual(true)
})
