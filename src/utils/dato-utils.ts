import dayjs from 'dayjs'

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
