import { expect } from '@jest/globals'
import dayjs from 'dayjs'

import { Sykmelding } from '../../types/sykmelding'

import { skalViseOppfoelgingsplanLenke } from './skalViseOppfoelgingsplanLenke'

it('Returnerer false hvis ingenting er fetchet', () => {
    const skalVise = skalViseOppfoelgingsplanLenke(undefined, undefined)
    expect(skalVise).toEqual(false)
})

it('Returnerer true hvis undefined sykmeldinger men oppfølgingsplaner', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skalVise = skalViseOppfoelgingsplanLenke(undefined, [{ id: 1 } as any])
    expect(skalVise).toEqual(true)
})

it('Returnerer false hvis undefined sykmeldinger og ingen oppfølgingsplaner', () => {
    const skalVise = skalViseOppfoelgingsplanLenke(undefined, [])
    expect(skalVise).toEqual(false)
})

it('Returnerer false hvis ingen sykmeldinger og ingen oppfølgingsplaner', () => {
    const skalVise = skalViseOppfoelgingsplanLenke([], [])
    expect(skalVise).toEqual(false)
})

it('Returnerer false hvis en gammel sykmelding og ingen oppfølgingsplaner', () => {
    const fireMånederOgToDagerSiden = dayjs().subtract(4, 'months').subtract(2, 'days').format('YYYY-MM-DD')
    const sykmelding: Sykmelding = {
        id: 'APEN',
        sykmeldingStatus: {
            statusEvent: 'APEN',
            arbeidsgiver: { orgnummer: '1234', orgNavn: 'Jobben' },
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [{ fom: '2021-03-01', tom: fireMånederOgToDagerSiden }],
    }
    const skalVise = skalViseOppfoelgingsplanLenke([sykmelding], [])
    expect(skalVise).toEqual(false)
})

it('Returnerer true hvis en nesten 4 måneder gammel sykmelding og ingen oppfølgingsplaner', () => {
    const nestenFireMånederSiden = dayjs().subtract(4, 'months').add(2, 'days').format('YYYY-MM-DD')
    const sykmelding: Sykmelding = {
        id: 'APEN',
        sykmeldingStatus: {
            statusEvent: 'APEN',
            arbeidsgiver: { orgnummer: '1234', orgNavn: 'Jobben' },
        },
        behandlingsutfall: { status: 'OK' },
        sykmeldingsperioder: [{ fom: '2021-03-01', tom: nestenFireMånederSiden }],
    }
    const skalVise = skalViseOppfoelgingsplanLenke([sykmelding], [])
    expect(skalVise).toEqual(true)
})
