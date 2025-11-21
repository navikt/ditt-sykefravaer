import dayjs from 'dayjs'

export interface Oppgave {
    skeleton?: boolean
    type?: 'info' | 'warning' | 'success' | 'error'
    tekst: string
    lenke?: string
    lukkbar?: boolean
    meldingType?: string //overstyrer tekst for umami måling hvis tekst er sensitiv
    id?: string
    opprettet?: dayjs.Dayjs
}
