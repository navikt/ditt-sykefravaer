import {
    add,
    differenceInDays,
    formatISO,
    getDate,
    isSameDay,
    isSameMonth,
    isSameYear,
    parseISO,
    sub,
    Duration,
    format,
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
    return formatISO(date, { representation: 'date' })
}

export function toReadableDate(date: string | Date): string {
    return format(toDateIfString(date), `d. MMMM yyyy`, { locale: nb })
}

export function toReadableDateNoYear(date: string | Date): string {
    return format(toDateIfString(date), 'd. MMMM', { locale: nb })
}

/**
 * Get a text representation of the period fom to tom
 * @return {string} The period string
 */
export function toReadableDatePeriod(fom: string | Date, tom: string | Date): string {
    const fomDate = toDateIfString(fom)
    const tomDate = toDateIfString(tom)
    if (isSameDay(fomDate, tomDate)) {
        return toReadableDate(fomDate)
    } else if (isSameMonth(fomDate, tomDate)) {
        return `${getDate(fomDate)}. - ${toReadableDate(tomDate)}`
    } else if (isSameYear(fomDate, tomDate)) {
        return `${toReadableDateNoYear(fomDate)} - ${toReadableDate(tomDate)}`
    } else {
        return `${toReadableDate(fomDate)} - ${toReadableDate(tomDate)}`
    }
}
export function diffInDays(fom: string, tom: string): number {
    return differenceInDays(parseISO(tom), parseISO(fom)) + 1
}

export function sortDatesASC(dates: Date[]): Date[] {
    return sortBy(dates, [(date) => date, 'asc'])
}

function isoTimestampHasTimeZone(iso: string): boolean {
    return /([Zz]|[+-]\d{2}:\d{2})$/.test(iso)
}

function toDateIfString(date: string | Date): Date {
    return typeof date === 'string' ? toDate(date) : date
}
