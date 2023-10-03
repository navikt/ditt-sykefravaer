import { isValid } from 'date-fns'
import format from 'date-fns/format'

export function formatDate(date?: Date): string {
    if (!date || !isValid(date)) {
        return ''
    }

    return format(date, 'dd.MM.yyyy')
}

export function formatDateFromString(date: string): string {
    return format(new Date(date), 'dd.MM.yyyy')
}
