import BannerTekster from '../components/banner/banner-tekster'
import ForsideTekster from '../pages/forside/forside-tekster'
import { logger } from './logger'

const tekster = {
    ...BannerTekster,
    ...ForsideTekster,
}


type TekstKeys =
    keyof typeof BannerTekster |
    keyof typeof ForsideTekster;

export const tekst = (tekst: TekstKeys): string => {
    const verdi = tekster[tekst]
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
    return verdi
}

export const getLedetekst = (text: string, data: any): string => {
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
