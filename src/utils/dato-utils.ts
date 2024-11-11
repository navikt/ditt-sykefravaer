import dayjs from 'dayjs'
import {
    add,
    differenceInDays,
    format,
    formatISO,
    getDate,
    isSameDay,
    isSameMonth,
    isSameYear,
    parseISO,
    sub,
    Duration,
} from 'date-fns'
import { sortBy } from 'remeda'
import { nb } from 'date-fns/locale/nb'

export function formatDateFromString(date: string): string {
    return dayjs(date).format('DD.MM.YYYY')
}

const maaneder = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
]

export const tilLesbarDatoUtenAarstall = (datoArg: Date | string): string => {
    if (datoArg) {
        const dato = new Date(datoArg)
        const dag = dato.getDate()
        const manedIndex = dato.getMonth()
        const maned = maaneder[manedIndex]
        return `${dag}. ${maned}`
    }
    return ''
}

export const tilLesbarDatoMedArstall = (datoArg: Date | string) => {
    return datoArg ? `${tilLesbarDatoUtenAarstall(new Date(datoArg))} ${new Date(datoArg).getFullYear()}` : undefined
}

export const getManedsNavn = (maned: string): string => {
    const manedIndex = parseInt(maned, 10) - 1
    return maaneder[manedIndex] || maned
}

export const capitalizeFirstLetter = (text: string): string => (text ? text[0].toLocaleUpperCase() + text.slice(1) : '')

export function dateAdd(date: string | Date, duration: Duration): string {
    return toDateString(add(date, duration))
}

export function dateSub(date: string | Date, duration: Duration): string {
    return toDateString(sub(date, duration))
}

export function toDate(date: string): Date {
    return parseISO(date)
}

export function toDateString(date: Date): string {
    return formatISO(date, { representation: 'date' })
}

export function toReadableDate(date: string | Date): string {
    return format(date, `d. MMMM yyyy`, { locale: nb })
}

export function toReadableDateNoYear(date: string | Date): string {
    return format(date, 'd. MMMM', { locale: nb })
}

/**
 * Get a text representation of the period fom to tom
 * @return {string} The period string
 */
export function toReadableDatePeriod(fom: string | Date, tom: string | Date): string {
    if (isSameDay(fom, tom)) {
        return toReadableDate(fom)
    } else if (isSameMonth(fom, tom)) {
        return `${getDate(fom)}. - ${toReadableDate(tom)}`
    } else if (isSameYear(fom, tom)) {
        return `${toReadableDateNoYear(fom)} - ${toReadableDate(tom)}`
    } else {
        return `${toReadableDate(fom)} - ${toReadableDate(tom)}`
    }
}

export function diffInDays(fom: string, tom: string): number {
    return differenceInDays(parseISO(tom), parseISO(fom)) + 1
}

export function sortDatesASC(dates: Date[]): Date[] {
    return sortBy(dates, [(date) => date, 'asc'])
}
