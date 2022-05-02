export interface NarmesteLeder {
    navn?: string // Navn på leder ikke org
    orgnummer: string
    aktivFom: string
    aktivTom?: string // Er null hvis fortsatt aktiv leder
    arbeidsgiverForskutterer?: boolean
}
