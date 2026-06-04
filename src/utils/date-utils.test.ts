import { describe, it, expect } from 'vitest'
import { parseISO } from 'date-fns'

import { toReadableDate, toReadableDatePeriod, diffInDays } from './dato-utils'

describe('toReadableDate', () => {
    it('Formatterer dato riktig med årstall', () => {
        const date = parseISO('2021-01-05')
        expect(toReadableDate(date)).toBe('5. januar 2021')
    })
})

describe('toReadableDatePeriod', () => {
    it('Returnerer måned og år bare én gang hvis fom og tom har samme måned og år', () => {
        expect(toReadableDatePeriod('2021-04-01', '2021-04-03')).toBe('1. - 3. april 2021')
    })
    it('Returnerer begge måneder hvis måneden er forskjellig og året er likt for fom og tom', () => {
        expect(toReadableDatePeriod('2021-01-01', '2021-04-03')).toBe('1. januar - 3. april 2021')
    })
    it('Returnerer begge måneder og år hvis måneden og året er forskjellig', () => {
        expect(toReadableDatePeriod('2020-12-01', '2021-02-03')).toBe('1. desember 2020 - 3. februar 2021')
    })
})

describe('diffInDays', () => {
    it('fom/tom same day', () => {
        expect(diffInDays('2021-04-29', '2021-04-29')).toBe(1)
    })

    it('fom/tom within same month', () => {
        expect(diffInDays('2021-04-01', '2021-04-03')).toBe(3)
    })

    it('fom/tom across months', () => {
        expect(diffInDays('2021-04-29', '2021-05-01')).toBe(3)
    })

    it('fom/tom across year', () => {
        expect(diffInDays('2021-12-31', '2022-01-01')).toBe(2)
    })
})
