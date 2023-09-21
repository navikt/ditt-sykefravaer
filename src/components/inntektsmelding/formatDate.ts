import { isValid } from 'date-fns'
import format from 'date-fns/format'

export function formatDate(date?: Date): string {
    if (!date || !isValid(date)) {
        return ''
    }

    return format(date, 'dd.MM.yyyy')
}

export function formatDateFromString(date?: string): string {
    if (!date) {
        return ''
    }

    return format(new Date(date), 'dd.MM.yyyy')
}

/** Funskjon som formatterer klokkeslsett fra ISO format til HH:mm med dayjs */
export function formatTime(dateTime?: string) {
    if (!dateTime) {
        return ''
    }
    return format(new Date(dateTime), 'HH:mm')
}
