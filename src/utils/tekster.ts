import { logger } from '@navikt/next-logger'

import { ArbeidssituasjonTekster } from '../components/arbeidssituasjon/arbeidssituasjonTekster'
import { BannerTekster } from '../components/banner/bannerTekster'
import { ForsideTekster } from '../components/forside/forsideTekster'
import { ingenSykmeldingTekster } from '../components/ingen-sykmelding/ingenSykmeldingTekster'
import { InntektsmeldingTekster } from '../components/inntektsmelding/inntektsmeldingTekster'
import { LenkerTekster } from '../components/lenker/lenkerTekster'
import { OppgaverTekster } from '../components/oppgaver/oppgaverTekster'
import { StringMap } from '../types/stringMap'

const tekster = {
    ...BannerTekster,
    ...LenkerTekster,
    ...ForsideTekster,
    ...OppgaverTekster,
    ...ingenSykmeldingTekster,
    ...ArbeidssituasjonTekster,
    ...InntektsmeldingTekster,
}

type TekstKeys =
    | keyof typeof BannerTekster
    | keyof typeof LenkerTekster
    | keyof typeof OppgaverTekster
    | keyof typeof ingenSykmeldingTekster
    | keyof typeof ForsideTekster
    | keyof typeof ArbeidssituasjonTekster
    | keyof typeof InntektsmeldingTekster

export const byttTekstInnhold = (text: string, data: StringMap): string => {
    if (text === undefined || data === undefined) {
        return ''
    }
    let newtext = text
    Object.keys(data).forEach((key) => {
        const regex = new RegExp(key, 'g')
        newtext = newtext.replace(regex, data[key])
    })
    return newtext
}

export const tekst = (tekst: TekstKeys, data?: StringMap): string => {
    const verdi = tekster[tekst]
    // Generiskfeilmelding har ingen tekst
    if (!verdi === undefined && !tekst.includes('soknad.feilmelding')) {
        logger.error(`Mangler teksten [ ${tekst} ]`)
        return tekst
    }
    if (verdi === undefined) {
        return tekst
    }
    if (data) {
        return byttTekstInnhold(verdi, data)
    }
    return verdi
}
