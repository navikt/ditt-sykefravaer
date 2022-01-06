import { AktivitetskravTekster } from '../components/aktivitetskrav/aktivitetskravTekster'
import { ArbeidssituasjonTekster } from '../components/arbeidssituasjon/arbeidssituasjonTekster'
import { BannerTekster } from '../components/banner/bannerTekster'
import { ForsideTekster } from '../components/forside/forsideTekster'
import { ingenSykmeldingTekster } from '../components/ingen-sykmelding/ingenSykmeldingTekster'
import { LenkerTekster } from '../components/lenker/lenkerTekster'
import { OppgaverTekster } from '../components/oppgaver/oppgaverTekster'
import { SnartsluttTekster } from '../components/snart-slutt/snartsluttTekster'
import { TidslinjeUtdragTekster } from '../components/tidslinje-utdrag/tidslinjeUtdragTekster'
import { TidslinjenTekster } from '../components/tidslinjen/tidslinjenTekster'
import { StringMap } from '../types/stringMap'
import { logger } from './logger'

const tekster = {
    ...BannerTekster,
    ...LenkerTekster,
    ...ForsideTekster,
    ...SnartsluttTekster,
    ...OppgaverTekster,
    ...ingenSykmeldingTekster,
    ...ArbeidssituasjonTekster,
    ...TidslinjeUtdragTekster,
    ...TidslinjenTekster,
    ...AktivitetskravTekster,
}


type TekstKeys =
    keyof typeof BannerTekster |
    keyof typeof LenkerTekster |
    keyof typeof OppgaverTekster |
    keyof typeof ingenSykmeldingTekster |
    keyof typeof ForsideTekster |
    keyof typeof SnartsluttTekster |
    keyof typeof ArbeidssituasjonTekster |
    keyof typeof TidslinjeUtdragTekster |
    keyof typeof AktivitetskravTekster |
    keyof typeof TidslinjenTekster

export const byttTekstInnhold = (text: string, data: StringMap): string => {
    if (text === undefined || data === undefined) {
        return ''
    }
    let newtext = text
    Object.keys(data).forEach((key) => {
        const regex = new RegExp(key, 'g')
        newtext = newtext.replace(regex, data[ key ])
    })
    return newtext
}

export const tekst = (tekst: TekstKeys, data?: StringMap): string => {
    const verdi = tekster[ tekst ]
    // Generiskfeilmelding har ingen tekst
    if (!verdi === undefined && !tekst.includes('soknad.feilmelding')) {
        // eslint-disable-next-line no-console
        console.log(`Mangler teksten [ ${tekst} ]`)
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


