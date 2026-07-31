import { expect, it } from 'vitest'
import dayjs from 'dayjs'

import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { testDato } from '../../data/mock/mock-db/data-creators'

import { skalViseOppfoelgingsplanLenke } from './skalViseOppfoelgingsplanLenke'

const lagSykmelding = (
    tom: string,
    arbeidsgiver: DittSykefravaerSykmelding['sykmeldingStatus']['arbeidsgiver'],
): DittSykefravaerSykmelding => ({
    id: 'APEN',
    sykmeldingStatus: {
        statusEvent: 'APEN',
        arbeidsgiver,
    },
    behandlingsutfall: { status: 'OK', erUnderBehandling: false },
    sykmeldingsperioder: [{ fom: '2021-03-01', tom }],
})

it('returnerer false når sykmeldinger ikke er hentet', () => {
    expect(skalViseOppfoelgingsplanLenke(undefined, testDato)).toBe(false)
})

it('returnerer false når personen ikke har sykmeldinger', () => {
    expect(skalViseOppfoelgingsplanLenke([], testDato)).toBe(false)
})

it('returnerer false når sykmeldingen ikke er knyttet til en arbeidsgiver', () => {
    const sykmelding = lagSykmelding(dayjs(testDato).format('YYYY-MM-DD'), null)

    expect(skalViseOppfoelgingsplanLenke([sykmelding], testDato)).toBe(false)
})

it('returnerer false når arbeidsgiver mangler fra sykmeldingsstatusen', () => {
    const sykmelding = lagSykmelding(dayjs(testDato).format('YYYY-MM-DD'), undefined)

    expect(skalViseOppfoelgingsplanLenke([sykmelding], testDato)).toBe(false)
})

it('returnerer false når sykmeldingen med arbeidsgiver er eldre enn seks måneder', () => {
    const eldreEnnSeksMaaneder = dayjs(testDato).subtract(6, 'months').subtract(2, 'days').format('YYYY-MM-DD')
    const sykmelding = lagSykmelding(eldreEnnSeksMaaneder, { orgnummer: '1234', orgNavn: 'Jobben' })

    expect(skalViseOppfoelgingsplanLenke([sykmelding], testDato)).toBe(false)
})

it('returnerer true når sykmeldingen med arbeidsgiver er innenfor seks måneder', () => {
    const innenforSeksMaaneder = dayjs(testDato).subtract(6, 'months').add(2, 'days').format('YYYY-MM-DD')
    const sykmelding = lagSykmelding(innenforSeksMaaneder, { orgnummer: '1234', orgNavn: 'Jobben' })

    expect(skalViseOppfoelgingsplanLenke([sykmelding], testDato)).toBe(true)
})

it('returnerer true på selve seksmånedersgrensen', () => {
    const seksMaanederSiden = dayjs(testDato).subtract(6, 'months').format('YYYY-MM-DD')
    const sykmelding = lagSykmelding(seksMaanederSiden, { orgnummer: '1234', orgNavn: 'Jobben' })

    expect(skalViseOppfoelgingsplanLenke([sykmelding], testDato)).toBe(true)
})

it('krever ikke at sykmeldingen har status sendt', () => {
    const sykmelding = lagSykmelding(dayjs(testDato).format('YYYY-MM-DD'), {
        orgnummer: '1234',
        orgNavn: 'Jobben',
    })

    expect(sykmelding.sykmeldingStatus.statusEvent).toBe('APEN')
    expect(skalViseOppfoelgingsplanLenke([sykmelding], testDato)).toBe(true)
})
