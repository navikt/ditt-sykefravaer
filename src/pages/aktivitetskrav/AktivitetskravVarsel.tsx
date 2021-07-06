import dayjs from 'dayjs'
import Alertstripe from 'nav-frontend-alertstriper'
import React, { useEffect, useRef, useState } from 'react'

import Vis from '../../components/Vis'
import { tekst } from '../../utils/tekster'
import Artikkel from './Artikkel'
import BekreftAktivitetskravSkjema from './BekreftAktivitetskravSkjema'

export const INGEN_AKTIVITETSKRAVVARSEL = 'INGEN_AKTIVITETSKRAVVARSEL'
export const NYTT_AKTIVITETSKRAVVARSEL = 'NYTT_AKTIVITETSKRAVVARSEL'
export const AKTIVITETSVARSELKVITTERING = 'AKTIVITETSVARSELKVITTERING'

export const AKTIVITETSKRAV_VARSEL = 'AKTIVITETSKRAV_VARSEL'
export const AKTIVITETSKRAV_BEKREFTET = 'AKTIVITETSKRAV_BEKREFTET'
export const NY_NAERMESTE_LEDER = 'NY_NAERMESTE_LEDER'

// eslint-disable-next-line
const sorterHendelser = (a: any, b: any) => {
    if (a.inntruffetdato.getTime() > b.inntruffetdato.getTime()) {
        return -1
    }
    if (a.inntruffetdato.getTime() < b.inntruffetdato.getTime()) {
        return 1
    }
    return 0
}

// eslint-disable-next-line
const getSisteAktivitetskrav = (hendelser: any) => {
    return [ ...hendelser ]
        .sort(sorterHendelser)
        .filter((h) => {
            return h.type === AKTIVITETSKRAV_VARSEL
        })[0]
}

// eslint-disable-next-line
const getBekreftelseAvAktivitetskrav = (hendelser: any, aktivitetskrav: any) => {
    return hendelser
        // eslint-disable-next-line
        .filter((h: any) => {
            return h.type === AKTIVITETSKRAV_BEKREFTET
        })
        // eslint-disable-next-line
        .filter((h: any) => {
            return parseInt(h.ressursId, 10) === aktivitetskrav.id
        })[0]
}

// eslint-disable-next-line
export const getAktivitetskravvisning = (hendelser: any) => {
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
    const [ forrigeVisning, setForrigeVisning ] = useState('')
    const [ visning, setVisning ] = useState('')
    const kvittering = useRef<HTMLDivElement>(null)

    // TODO: hendelser må hentes fra backend
    const hendelser = [
        { id: 1, inntruffetdato: new Date('2017-08-02'), type: 'NY_NAERMESTE_LEDER' },
        { id: 2, inntruffetdato: new Date('2017-09-18'), type: 'AKTIVITETSKRAV_VARSEL', ressursId: '' },
        { id: 3, inntruffetdato: new Date('2017-09-18'), type: 'AKTIVITETSKRAV_BEKREFTET', ressursId: '2' }
    ]

    useEffect(()=>{
        setForrigeVisning(visning)
        setVisning(getAktivitetskravvisning(hendelser))
        // eslint-disable-next-line
    }, [])

    // TODO: hente bekreftetdato fra "bekreftelseAvSisteAktivitetskrav.inntruffetdato"
    const bekreftetdato = new Date()

    // TODO: hente varseldato fra "sisteAktivitetskrav.inntruffetdato"
    const varseldato = new Date()

    useEffect(() => {
        if (visning === AKTIVITETSVARSELKVITTERING && forrigeVisning === NYTT_AKTIVITETSKRAVVARSEL) {
            kvittering.current?.scrollTo({ top: 200 })
        }
    })


    return (
        <>
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

            <Artikkel inntruffetdato={varseldato} />

            <Vis hvis={visning !== AKTIVITETSVARSELKVITTERING}
                render={() => {
                    return <BekreftAktivitetskravSkjema />
                }}
            />
        </>
    )
}

export default AktivitetskravVarsel
