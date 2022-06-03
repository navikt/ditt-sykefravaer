export interface Melding {
    uuid: string
    tekst: string
    lenke?: string
    variant: 'info' | 'warning' | 'success' | 'error'
    lukkbar: boolean
    opprettet: string
}
