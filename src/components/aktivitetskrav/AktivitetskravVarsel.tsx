import dayjs from 'dayjs'
import Alertstripe, { AlertStripeAdvarsel } from 'nav-frontend-alertstriper'
import { Normaltekst, Sidetittel, Undertittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import useHendelser from '../../query-hooks/useHendelser'
import { SimpleHendelse } from '../../types/hendelse'
import setBodyClass from '../../utils/setBodyClass'
import { tekst } from '../../utils/tekster'
import Banner from '../banner/Banner'
import Brodsmuler, { Brodsmule } from '../brodsmuler/Brodsmuler'
import Vis from '../Vis'
import Artikkel from './Artikkel'
import BekreftAktivitetskravSkjema from './BekreftAktivitetskravSkjema'

export const INGEN_AKTIVITETSKRAVVARSEL = 'INGEN_AKTIVITETSKRAVVARSEL'
export const NYTT_AKTIVITETSKRAVVARSEL = 'NYTT_AKTIVITETSKRAVVARSEL'
export const AKTIVITETSVARSELKVITTERING = 'AKTIVITETSVARSELKVITTERING'

export const AKTIVITETSKRAV_VARSEL = 'AKTIVITETSKRAV_VARSEL'
export const AKTIVITETSKRAV_BEKREFTET = 'AKTIVITETSKRAV_BEKREFTET'

const brodsmuler: Brodsmule[] = [
    { tittel: 'Påminnelse om aktivitet', sti: '/aktivitetsplikt', erKlikkbar: false }
]

const sorterHendelser = (a: SimpleHendelse, b: SimpleHendelse) => {
    return dayjs(b.inntruffetdato).unix() - dayjs(a.inntruffetdato).unix()
}

const getSisteAktivitetskravVarsel = (hendelser: SimpleHendelse[]) => {
    return hendelser
        .sort(sorterHendelser)
        .filter((h) => {
            return h.type === AKTIVITETSKRAV_VARSEL
        })[ 0 ]
}

const getBekreftelseAvAktivitetskrav = (hendelser: SimpleHendelse[], aktivitetskrav: SimpleHendelse) => {
    return hendelser
        .filter((h: SimpleHendelse) => {
            return h.type === AKTIVITETSKRAV_BEKREFTET
        })
        .filter((h: SimpleHendelse) => {
            return dayjs(h.inntruffetdato) >= dayjs(aktivitetskrav.inntruffetdato)
        })[ 0 ]
}

const getSisteAktivitetskrav = (hendelser: SimpleHendelse[]) => {
    const sisteAktivitetskravVarsel = getSisteAktivitetskravVarsel(hendelser)
    const bekreftelseAvSisteAktivitetskrav = getBekreftelseAvAktivitetskrav(hendelser, sisteAktivitetskravVarsel)

    if (bekreftelseAvSisteAktivitetskrav) {
        return bekreftelseAvSisteAktivitetskrav
    }
    return sisteAktivitetskravVarsel
}

export const getAktivitetskravvisning = (hendelser: SimpleHendelse[]) => {
    const sisteAktivitetskrav = getSisteAktivitetskrav(hendelser)

    if (sisteAktivitetskrav === undefined) {
        return INGEN_AKTIVITETSKRAVVARSEL
    }
    if (sisteAktivitetskrav.type === 'AKTIVITETSKRAV_BEKREFTET') {
        return AKTIVITETSVARSELKVITTERING
    }
    return NYTT_AKTIVITETSKRAVVARSEL
}

const AktivitetskravVarsel = () => {
    const { data: hendelser, isFetching } = useHendelser()
    const [ visning, setVisning ] = useState('')
    const [ bekreftetdato, setBekreftetdato ] = useState<string | undefined>()

    useEffect(() => {
        setBodyClass('aktivitetskrav')
    }, [])

    useEffect(() => {
        if (!isFetching && hendelser) {
            setVisning(getAktivitetskravvisning(hendelser))

            const sisteAktivitetskrav = getSisteAktivitetskrav(hendelser)
            if (sisteAktivitetskrav) {
                setBekreftetdato(sisteAktivitetskrav.inntruffetdato)
            }
        }
        // eslint-disable-next-line
    }, [ isFetching ])

    useEffect(() => {
        if (visning === AKTIVITETSVARSELKVITTERING) {
            window.scrollTo({ top: 0 })
        }
    }, [ visning ])

    return (
        <>
            <Banner>
                <Sidetittel className="sidebanner__tittel">
                    {tekst('sidetittel.liste')}
                </Sidetittel>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <Vis hvis={visning === INGEN_AKTIVITETSKRAVVARSEL}
                    render={() => {
                        return (
                            <AlertStripeAdvarsel>
                                <Undertittel>{tekst('aktivitetskrav-varsel.ingen-varsel.tittel')}</Undertittel>
                                <Normaltekst>{tekst('aktivitetskrav-varsel.ingen-varsel.melding')}</Normaltekst>
                            </AlertStripeAdvarsel>
                        )
                    }}
                />

                <Vis hvis={visning === NYTT_AKTIVITETSKRAVVARSEL}
                    render={() => {
                        return (
                            <>
                                <Artikkel />
                                <BekreftAktivitetskravSkjema />
                            </>
                        )
                    }}
                />

                <Vis hvis={visning === AKTIVITETSVARSELKVITTERING}
                    render={() => {
                        return (
                            <>
                                <div aria-live="polite" role="alert">
                                    <Alertstripe type="suksess" className="aktivitetskrav-kvittering">
                                        {tekst('aktivitetskrav-varsel.kvittering', {
                                            '%DATO%': dayjs(bekreftetdato).format('DD.MM.YYYY'),
                                        })}
                                    </Alertstripe>
                                </div>

                                <Artikkel />
                            </>
                        )
                    }}
                />
            </div>
        </>
    )
}

export default AktivitetskravVarsel
