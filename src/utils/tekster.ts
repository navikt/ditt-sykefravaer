import { BannerTekster } from '../components/banner/banner-tekster'
import { IngenSykmeldingTekster } from '../components/ingen-sykmelding/ingen-sykmelding-tekster'
import { LenkerTekster } from '../components/lenker/lenker-tekster'
import { OppgaverTekster } from '../components/oppgaver/oppgaver-tekster'
import { ForsideTekster } from '../pages/forside/forside-tekster'
import { StringMap } from '../types/simple-types'
import { logger } from './logger'

const tekster: any = {
    ...BannerTekster,
    ...LenkerTekster,
    ...ForsideTekster,
    ...OppgaverTekster,
    ...IngenSykmeldingTekster,
}


type TekstKeys =
    keyof typeof BannerTekster |
    keyof typeof LenkerTekster |
    keyof typeof OppgaverTekster |
    keyof typeof IngenSykmeldingTekster |
    keyof typeof ForsideTekster;


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
