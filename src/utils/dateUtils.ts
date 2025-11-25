import {
    add,
    differenceInDays,
    Duration,
    format,
    formatISO,
    getDate,
    isSameDay,
    isSameMonth,
    isSameYear,
    parseISO,
    sub,
} from 'date-fns'
import { nb } from 'date-fns/locale/nb'
import { sortBy } from 'remeda'
import { TZDate } from '@date-fns/tz'

export function dateAdd(date: string | Date, duration: Duration): string {
    return toDateString(add(date, duration))
}

export function dateSub(date: string | Date, duration: Duration): string {
    return toDateString(sub(date, duration))
}

export function toDate(date: string, defaultTimezone: string = 'Europe/Oslo'): Date {
    if (isoTimestampHasTimeZone(date)) {
        return parseISO(date)
    } else {
        return new TZDate(date, defaultTimezone)
    }
}

export function toDateString(date: Date): string {
    return formatISO(toOsloDate(date), { representation: 'date' })
}

export function toReadableDate(date: string | Date): string {
    return format(toOsloDate(date), `d. MMMM yyyy`, { locale: nb })
}

export function toReadableDatePeriod(fom: string | Date, tom: string | Date): string {
    if (isSameDay(fom, tom)) {
        return toReadableDate(fom)
    } else if (isSameMonth(fom, tom)) {
        return `${getDate(toOsloDate(fom))}. - ${toReadableDate(tom)}`
    } else if (isSameYear(fom, tom)) {
        return `${toReadableDateNoYear(fom)} - ${toReadableDate(tom)}`
    } else {
        return `${toReadableDate(fom)} - ${toReadableDate(tom)}`
    }
}
export function diffInDays(fom: string, tom: string): number {
    const fomDateUTC = new TZDate(toDate(fom), 'UTC')
    const tomDateUTC = new TZDate(toDate(tom), 'UTC')
    return differenceInDays(tomDateUTC, fomDateUTC) + 1
}

export function sortDatesASC(dates: Date[]): Date[] {
    return sortBy(dates, [(date) => date, 'asc'])
}

function toOsloDate(date: string | Date): Date {
    const datoObj = typeof date === 'string' ? toDate(date) : date
    return new TZDate(datoObj, 'Europe/Oslo')
}

function isoTimestampHasTimeZone(iso: string): boolean {
    return /([Zz]|[+-]\d{2}:\d{2})$/.test(iso)
}

function toReadableDateNoYear(date: string | Date): string {
    return format(toOsloDate(date), 'd. MMMM', { locale: nb })
}
