export interface NarmesteLeder {
    navn: string;      // Navn på leder ikke org
    orgnummer: string;
    organisasjonsnavn: string;
    aktivTom?: string;  // Er null hvis fortsatt aktiv leder
    arbeidsgiverForskuttererLoenn?: boolean;
}
