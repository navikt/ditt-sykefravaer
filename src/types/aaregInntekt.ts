export interface AaregInntekt {
    id: string
    tidsstempel: string
    inntekter: { maned: string; belop: number }[]
    omregnetAarsinntekt: number
    orgnavn: string
}
