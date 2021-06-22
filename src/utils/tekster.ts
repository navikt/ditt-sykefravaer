import { ArbeidssituasjonTekster } from '../components/arbeidssituasjon/arbeidssituasjonTekster'
import { BannerTekster } from '../components/banner/bannerTekster'
import { ingenSykmeldingTekster } from '../components/ingen-sykmelding/ingenSykmeldingTekster'
import { LenkerTekster } from '../components/lenker/lenkerTekster'
import { OppgaverTekster } from '../components/oppgaver/oppgaverTekster'
import { TidslinjeUtdragTekster } from '../components/tidslinje-utdrag/tidslinjeUtdragTekster'
import { ForsideTekster } from '../pages/forside/forsideTekster'
import { SnartsluttTekster } from '../pages/snart-slutt/snartsluttTekster'
import { StringMap } from '../types/stringMap'
import { logger } from './logger'

const tekster: any = {
    ...BannerTekster,
    ...LenkerTekster,
    ...ForsideTekster,
    ...SnartsluttTekster,
    ...OppgaverTekster,
    ...ingenSykmeldingTekster,
    ...ArbeidssituasjonTekster,
    ...TidslinjeUtdragTekster,
}


type TekstKeys =
    keyof typeof BannerTekster |
    keyof typeof LenkerTekster |
    keyof typeof OppgaverTekster |
    keyof typeof ingenSykmeldingTekster |
    keyof typeof ForsideTekster |
    keyof typeof SnartsluttTekster |
    keyof typeof ArbeidssituasjonTekster |
    keyof typeof TidslinjeUtdragTekster


export const tekst = (tekst: TekstKeys, data?: StringMap): string => {
    const verdi = tekster[ tekst ]
    // Generiskfeilmelding har ingen tekst
    if (!verdi === undefined && !tekst.includes('soknad.feilmelding')) {
        // eslint-disable-next-line no-console
        console.log(`Mangler teksten [ ${tekst} ]`)
        logger.error(`Mangler teksten [ ${tekst} ]`)
        return undefined as any
    }
    if (verdi === undefined) {
        return tekst
    }
    if (data) {
        return byttTekstInnhold(verdi, data)
    }
    return verdi
}

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
