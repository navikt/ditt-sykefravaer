import { describe, it, expect } from 'vitest'
import { formatISO, sub } from 'date-fns'

import { Periodetype, StatusEvent, Sykmelding } from '../types/sykmelding/sykmelding'
import { testDato } from '../data/mock/mock-db/data-creators'

import { dateAdd, dateSub } from './dateUtils'
import { createSykmelding, createUnderBehandlingMerknad } from './test/dataUtils'
import { findOlderSykmeldingId } from './findOlderSykmeldingId'

describe('findOlderSykmeldingId', () => {
    it('should find the earlier sykmelding when there is one APEN before', async () => {
        const sykmeldinger = [
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'SYKME-1' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 2 }), id: 'SYKME-2' }),
            createSykmelding({ mottattTidspunkt: dateAdd(testDato, { days: 15 }), id: 'SYKME-3' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[1], sykmeldinger)

        expect(result.earliestSykmeldingId).toEqual('SYKME-1')
    })

    it('should find the earlier sykmelding but disregard the sykmelding that is older than 12 months', async () => {
        const sykmeldinger = [
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { months: 12, days: 16 }), id: 'SYKME-0' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'SYKME-1' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 2 }), id: 'SYKME-2' }),
            createSykmelding({ mottattTidspunkt: dateAdd(testDato, { days: 15 }), id: 'SYKME-3' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[2], sykmeldinger)

        expect(result.earliestSykmeldingId).toEqual('SYKME-1')
    })

    it('should find the earlier sykmelding but disregard the sykmelding that does not have APEN status', async () => {
        const sykmeldinger = [
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 40 }), id: 'SYKME-0' }, StatusEvent.AVBRUTT),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'SYKME-1' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 2 }), id: 'SYKME-2' }),
            createSykmelding({ mottattTidspunkt: dateAdd(testDato, { days: 15 }), id: 'SYKME-3' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[2], sykmeldinger)

        expect(result.earliestSykmeldingId).toEqual('SYKME-1')
    })

    it('should find the earliest sykmelding', async () => {
        const sykmeldinger = [
            // 2 dager siden
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 2 }), id: 'this-sykmelding' }),
            // 30 dager siden
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'previous-sykmelding' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[0], sykmeldinger)
        expect(result.earliestSykmeldingId).toEqual('previous-sykmelding')
    })

    it('should find the earlier sykmelding but disregard the sykmelding that is APEN but UNDER_BEHANDLING', async () => {
        const sykmeldinger = [
            createSykmelding({
                mottattTidspunkt: formatISO(sub(testDato, { days: 366 })),
                id: 'SYKME-0',
                ...createUnderBehandlingMerknad(),
            }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'SYKME-1' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 2 }), id: 'SYKME-2' }),
            createSykmelding({ mottattTidspunkt: dateAdd(testDato, { days: 15 }), id: 'SYKME-3' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[2], sykmeldinger)
        expect(result.earliestSykmeldingId).toEqual('SYKME-1')
    })

    it('should handle being the first sykmelding', async () => {
        const sykmeldinger = [
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'SYKME-1' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 15 }), id: 'SYKME-2' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 2 }), id: 'SYKME-3' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[0], sykmeldinger)
        expect(result.earliestSykmeldingId).toBeNull()
    })

    it('should allow two sykmeldinger with the exact same period', async () => {
        const sykmeldinger = [
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 7 }), id: 'SYKME-1' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 7 }), id: 'SYKME-2' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[1], sykmeldinger)
        expect(result.earliestSykmeldingId).toBeNull()
    })

    it('should still work when the two first sykmeldinger has same date but the provided sykmelding is later', async () => {
        const sykmeldinger = [
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'SYKME-1' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 30 }), id: 'SYKME-2' }),
            createSykmelding({ mottattTidspunkt: dateSub(testDato, { days: 7 }), id: 'SYKME-3' }),
        ]

        const result = findOlderSykmeldingId(sykmeldinger[2], sykmeldinger)

        expect(result.earliestSykmeldingId).toEqual('SYKME-1')
    })

    describe('should work when there is overlap between sykmeldinger', () => {
        const createSingle10PeriodApen = (date: string, id: string): Sykmelding => ({
            ...createSykmelding({ mottattTidspunkt: date, id }),
            sykmeldingsperioder: [
                {
                    fom: date,
                    tom: dateAdd(date, { days: 10 }),
                    type: Periodetype.AKTIVITET_IKKE_MULIG,
                    aktivitetIkkeMulig: null,
                    reisetilskudd: false,
                    gradert: null,
                    behandlingsdager: null,
                    innspillTilArbeidsgiver: null,
                },
            ],
        })

        const newest = createSingle10PeriodApen(dateSub(testDato, { days: 1 }), 'SYKME-1')
        const oldest = createSingle10PeriodApen(dateSub(testDato, { days: 7 }), 'SYKME-2')

        it('newest should point to oldest', async () => {
            const result = findOlderSykmeldingId(newest, [newest, oldest])

            expect(result.earliestSykmeldingId).toEqual('SYKME-2')
        })

        it('oldest should NOT point to newest', async () => {
            const result = findOlderSykmeldingId(oldest, [newest, oldest])

            expect(result.earliestSykmeldingId).toBeNull()
        })
    })
})
