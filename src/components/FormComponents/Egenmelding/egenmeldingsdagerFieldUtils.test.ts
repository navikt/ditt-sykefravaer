import { describe, expect, it } from 'vitest'

import { toDate, toDateString } from '../../../utils/dateUtils'
import { YesOrNo } from '../../../types/sykmelding/sykmeldingCommon'

import { cumulativeDays, currentPeriodDatePicker } from './egenmeldingsdagerFieldUtils'
import { EgenmeldingsdagerFormValue } from './EgenmeldingerFieldHelpers'

describe('egenmeldingsdagerFieldUtils', () => {
    describe('grunntilfelle', () => {
        it('skal gi en periode på 16 foregående dager', () => {
            const [earliest, latest] = currentPeriodDatePicker(
                {
                    earliestPossibleDate: toDate('2022-05-17'),
                    earliestSelectedDate: null,
                },
                null,
            )

            expect(toDateString(earliest)).toEqual('2022-05-01')
            expect(toDateString(latest)).toEqual('2022-05-16')
        })

        it('med forrige sykmelding skal gi en periode dager til forrige sykmelding', () => {
            const [earliest, latest] = currentPeriodDatePicker(
                {
                    earliestPossibleDate: toDate('2022-05-17'),
                    earliestSelectedDate: null,
                },
                toDate('2022-05-10'),
            )

            expect(toDateString(earliest)).toEqual('2022-05-11')
            expect(toDateString(latest)).toEqual('2022-05-16')
        })
    })

    describe('recursive case', () => {
        it('period should be from previous selected minus 16, but should not include already asked days', () => {
            const [earliest, latest] = currentPeriodDatePicker(
                {
                    earliestPossibleDate: toDate('2022-05-01'),
                    earliestSelectedDate: toDate('2022-05-05'),
                },
                null,
            )

            expect(toDateString(earliest)).toEqual('2022-04-19')
            expect(toDateString(latest)).toEqual('2022-04-30')
        })

        it('period should be from previous selected minus 16, but should not include already asked days, edge case with 1 day', () => {
            const [earliest, latest] = currentPeriodDatePicker(
                {
                    earliestPossibleDate: toDate('2022-05-01'),
                    earliestSelectedDate: toDate('2022-05-16'),
                },
                null,
            )

            expect(toDateString(earliest)).toEqual('2022-04-30')
            expect(toDateString(latest)).toEqual('2022-04-30')
        })

        it('period should be from previous selected minus 16, but should not include already asked days, edge case with 1 day', () => {
            const [earliest, latest] = currentPeriodDatePicker(
                {
                    earliestPossibleDate: toDate('2022-04-30'),
                    earliestSelectedDate: toDate('2022-04-30'),
                },
                null,
            )

            expect(toDateString(earliest)).toEqual('2022-04-14')
            expect(toDateString(latest)).toEqual('2022-04-29')
        })

        describe('given previous sykmelding', () => {
            it('period should be from previous selected minus 16, but should not include already asked days, and not go past previous sykmelding tom', () => {
                const [earliest, latest] = currentPeriodDatePicker(
                    {
                        earliestPossibleDate: toDate('2022-05-01'),
                        earliestSelectedDate: toDate('2022-05-05'),
                    },
                    toDate('2022-04-22'),
                )

                expect(toDateString(earliest)).toEqual('2022-04-23')
                expect(toDateString(latest)).toEqual('2022-04-30')
            })

            it('kanttilfelle når alle dager er spurt om, og den forrige sykmeldingen til dato begrenser den tidligste datoen', () => {
                const [earliest, latest] = currentPeriodDatePicker(
                    {
                        earliestPossibleDate: toDate('2022-04-15'),
                        earliestSelectedDate: toDate('2022-04-17'),
                    },
                    toDate('2022-04-14'),
                )

                // We expect the earliest to be after latest, this edge case is handled in the parent component
                expect(toDateString(earliest)).toEqual('2022-04-15')
                expect(toDateString(latest)).toEqual('2022-04-14')
            })
        })
    })
})

describe('cumulativeDays', () => {
    it('skal gi kumulative dager for den første perioden', () => {
        const noPeriods: EgenmeldingsdagerFormValue[] = []
        const { cumulativeBefore, cumulativeIncluding } = cumulativeDays(noPeriods, 0)

        expect(cumulativeBefore).toEqual(0)
        expect(cumulativeIncluding).toEqual(0)
    })

    it('skal håndtere enkelt uberørt skjemaverdi', () => {
        const singleNotTouched: EgenmeldingsdagerFormValue[] = [
            {
                datoer: null,
                harPerioder: null,
                hasClickedVidere: null,
            },
        ]
        const { cumulativeBefore, cumulativeIncluding } = cumulativeDays(singleNotTouched, 0)

        expect(cumulativeBefore).toEqual(0)
        expect(cumulativeIncluding).toEqual(0)
    })

    it('skal håndtere enkelt berørt skjemaverdi', () => {
        const singleNotTouched: EgenmeldingsdagerFormValue[] = [
            {
                datoer: [new Date(2024, 1, 15), new Date(2024, 1, 17)],
                harPerioder: YesOrNo.YES,
                hasClickedVidere: null,
            },
        ]
        const { cumulativeBefore, cumulativeIncluding } = cumulativeDays(singleNotTouched, 0)

        expect(cumulativeBefore).toEqual(0)
        expect(cumulativeIncluding).toEqual(2)
    })

    it('skal håndtere berørt+uberørt skjemaverdi', () => {
        const singleNotTouched: EgenmeldingsdagerFormValue[] = [
            {
                datoer: [new Date(2024, 1, 15), new Date(2024, 1, 17)],
                harPerioder: YesOrNo.YES,
                hasClickedVidere: null,
            },
            {
                datoer: null,
                harPerioder: null,
                hasClickedVidere: null,
            },
        ]
        const { cumulativeBefore, cumulativeIncluding } = cumulativeDays(singleNotTouched, 1)

        expect(cumulativeBefore).toEqual(2)
        expect(cumulativeIncluding).toEqual(2)
    })

    it('skal håndtere berørt+uberørt skjemaverdi når indeks 0', () => {
        const singleNotTouched: EgenmeldingsdagerFormValue[] = [
            {
                datoer: [new Date(2024, 1, 15), new Date(2024, 1, 17)],
                harPerioder: YesOrNo.YES,
                hasClickedVidere: null,
            },
            {
                datoer: null,
                harPerioder: null,
                hasClickedVidere: null,
            },
        ]
        const { cumulativeBefore, cumulativeIncluding } = cumulativeDays(singleNotTouched, 0)

        expect(cumulativeBefore).toEqual(0)
        expect(cumulativeIncluding).toEqual(2)
    })

    it('skal håndtere flere', () => {
        const singleNotTouched: EgenmeldingsdagerFormValue[] = [
            {
                datoer: [new Date(2024, 1, 15), new Date(2024, 1, 17)],
                harPerioder: YesOrNo.YES,
                hasClickedVidere: true,
            },
            {
                datoer: [new Date(2024, 1, 15), new Date(2024, 1, 17)],
                harPerioder: YesOrNo.YES,
                hasClickedVidere: true,
            },
            {
                datoer: [new Date(2024, 1, 15), new Date(2024, 1, 17)],
                harPerioder: YesOrNo.YES,
                hasClickedVidere: true,
            },
        ]

        expect(cumulativeDays(singleNotTouched, 0)).toEqual({ cumulativeBefore: 0, cumulativeIncluding: 2 })
        expect(cumulativeDays(singleNotTouched, 1)).toEqual({ cumulativeBefore: 2, cumulativeIncluding: 4 })
        expect(cumulativeDays(singleNotTouched, 2)).toEqual({ cumulativeBefore: 4, cumulativeIncluding: 6 })
    })
})
