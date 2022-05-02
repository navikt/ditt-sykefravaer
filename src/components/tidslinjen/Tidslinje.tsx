import { Dayjs } from 'dayjs'
import { Systemtittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import useHendelser from '../../query-hooks/useHendelser'
import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykeforloep from '../../query-hooks/useSykeforloep'
import { Hendelse } from '../../types/hendelse'
import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'
import { hentStartdatoFraSykeforloep } from '../tidslinje-utdrag/tidslinjeUtdragHjelpefunksjoner'
import { HendelseBoble, HendelseTittel } from './Hendelse'
import { leggTilTidshendelser } from './tidslinjenUtils'

interface TidslinjeProps {
    visning: Visning
}

export const Tidslinje = ({ visning }: TidslinjeProps) => {
    const [ startdato, setStartdato ] = useState<Dayjs>()
    const [ events, setEvents ] = useState<Hendelse[]>([])

    const { data: sykeforloep } = useSykeforloep()
    const { data: narmesteLedere } = useNarmesteledere()
    const { data: hentetHendelser } = useHendelser()

    useEffect(() => {
        const start = hentStartdatoFraSykeforloep(sykeforloep)
        const hendelser: Hendelse[] = leggTilTidshendelser(visning, hentetHendelser, narmesteLedere, start)
        setStartdato(start)
        setEvents(hendelser)
    }, [ hentetHendelser, narmesteLedere, sykeforloep, visning ])

    const skalViseNyNaermesteLederHendelse = (hendelse: Hendelse) => {
        const ikkeVis = hendelse.type === 'NY_NAERMESTE_LEDER' && visning === 'UTEN_ARBEIDSGIVER'
        return !ikkeVis
    }

    return (
        <div className="tidslinje__ytre">
            <Systemtittel tag="h2">Tidslinje for sykefraværet</Systemtittel>

            <div className="tidslinje">
                {events
                    .filter(skalViseNyNaermesteLederHendelse)
                    .filter((h) =>
                        // Tidligere ble AKTIVITETSKRAV_BEKREFTET hentet og lagt i en annen state
                        h.type !== 'AKTIVITETSKRAV_VARSEL' && h.type !== 'AKTIVITETSKRAV_BEKREFTET'
                    )
                    .map((hendelse, idx) => {
                        if (hendelse.type === 'BOBLE' || hendelse.type === 'NY_NAERMESTE_LEDER') {
                            return <HendelseBoble key={idx + visning} hendelse={hendelse} />
                        }
                        return (
                            <HendelseTittel
                                key={idx + visning}
                                tekstkey={hendelse.tekstkey}
                                type={hendelse.type}
                                startdato={startdato}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
