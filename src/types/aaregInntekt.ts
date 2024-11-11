export interface AaregInntekt {
    tidsstempel: string
    inntekter: { maned: string; belop: number | null }[]
    omregnetAarsinntekt: number
    orgnavn: string
}
