export interface Oppgave {
    type?: 'info' | 'warning' | 'success' | 'error'
    tekst: string
    lenke?: string
}
