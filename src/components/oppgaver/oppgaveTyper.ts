import dayjs from 'dayjs'

export interface Oppgave {
    type?: 'info' | 'warning' | 'success' | 'error'
    tekst: string
    lenke?: string
    lukkbar?: boolean
    id?: string
    opprettet?: dayjs.Dayjs
}
