import dayjs from 'dayjs'

export interface Oppgave {
    type?: 'info' | 'warning' | 'success' | 'error'
    tekst: string
    lenke?: string
    lukkbar?: boolean
    meldingType?: string //overstyrer tekst for amplitude måling hvis tekst er sensitiv
    id?: string
    opprettet?: dayjs.Dayjs
}
