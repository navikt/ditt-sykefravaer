import dayjs from 'dayjs'
import Alertstripe from 'nav-frontend-alertstriper'
import { Sidetittel } from 'nav-frontend-typografi'
import React, { useEffect, useRef, useState } from 'react'

import Banner from '../../components/banner/Banner'
import Brodsmuler, { Brodsmule } from '../../components/brodsmuler/Brodsmuler'
import Vis from '../../components/Vis'
import useHendelser from '../../query-hooks/useHendelser'
import { SimpleHendelse } from '../../types/hendelse'
import { tekst } from '../../utils/tekster'
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
    if (dayjs(a.inntruffetdato) > dayjs(b.inntruffetdato)) {
        return -1
    }
    if (dayjs(a.inntruffetdato) < dayjs(b.inntruffetdato)) {
        return 1
    }
    return 0
}

const getSisteAktivitetskrav = (hendelser: SimpleHendelse[]) => {
    return hendelser
        .sort(sorterHendelser)
        .filter((h) => {
            return h.type === AKTIVITETSKRAV_VARSEL
        })[0]
}

const getBekreftelseAvAktivitetskrav = (hendelser: SimpleHendelse[], aktivitetskrav: SimpleHendelse) => {
    return hendelser
        .filter((h: SimpleHendelse) => {
            return h.type === AKTIVITETSKRAV_BEKREFTET
        })
        .filter((h: SimpleHendelse) => {
            return dayjs(h.inntruffetdato) >= dayjs(aktivitetskrav.inntruffetdato)
        })[0]
}

export const getAktivitetskravvisning = (hendelser: SimpleHendelse[]) => {
    const sisteAktivitetskrav = getSisteAktivitetskrav(hendelser)
    const bekreftelseAvSisteAktivitetskrav = getBekreftelseAvAktivitetskrav(hendelser, sisteAktivitetskrav)

    if (!sisteAktivitetskrav) {
        return INGEN_AKTIVITETSKRAVVARSEL
    }
    if (bekreftelseAvSisteAktivitetskrav) {
        return AKTIVITETSVARSELKVITTERING
    }
    return NYTT_AKTIVITETSKRAVVARSEL
}

const AktivitetskravVarsel = () => {
    const { data: hendelser, isFetching } = useHendelser()
    const [ forrigeVisning, setForrigeVisning ] = useState('')
    const [ visning, setVisning ] = useState('')
    const kvittering = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isFetching && hendelser) {
            setForrigeVisning(visning)
            setVisning(getAktivitetskravvisning(hendelser))
        }
        // eslint-disable-next-line
    }, [ isFetching ])

    // TODO: hente bekreftetdato fra "bekreftelseAvSisteAktivitetskrav.inntruffetdato"
    const bekreftetdato = new Date()

    useEffect(() => {
        if (visning === AKTIVITETSVARSELKVITTERING && forrigeVisning === NYTT_AKTIVITETSKRAVVARSEL) {
            kvittering.current?.scrollTo({ top: 200 })
        }
    })

    return (
        <>
            <Banner>
                <Sidetittel className="sidebanner__tittel">
                    {tekst('sidetittel.liste')}
                </Sidetittel>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">

                <Alertstripe type="info" className="blokk">
                    {tekst('aktivitetskrav-varsel.info')}
                </Alertstripe>

                <div aria-live="polite" role="alert" ref={kvittering}>
                    <Vis hvis={visning === AKTIVITETSVARSELKVITTERING}
                        render={() => {
                            return (
                                <Alertstripe type="suksess" className="aktivitetskrav-kvittering">
                                    {tekst('aktivitetskrav-varsel.kvittering', {
                                        '%DATO%': dayjs(bekreftetdato).format('DD.MM.YYYY'),
                                    })}
                                </Alertstripe>
                            )
                        }}
                    />
                </div>

                <Artikkel />

                <Vis hvis={visning !== AKTIVITETSVARSELKVITTERING}
                    render={() => {
                        return <BekreftAktivitetskravSkjema />
                    }}
                />

            </div>
        </>
    )
}

export default AktivitetskravVarsel
