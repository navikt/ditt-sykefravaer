export interface AaregInntekt {
    tidsstempel: string
    inntekter: { maned: string; belop: number }[]
    omregnetAarsinntekt: number
    orgnavn: string
}
