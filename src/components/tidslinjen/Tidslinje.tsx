import React from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykeforloep from '../../query-hooks/useSykeforloep'
import { Hendelse } from '../../types/hendelse'
import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'
import { hentStartdatoFraSykeforloep } from '../tidslinje-utdrag/tidslinjeUtdragHjelefunksjoner'
import { HendelseBoble, HendelseTittel } from './Hendelse'
import { leggTilTidshendelser } from './tidslinjenUtils'

interface TidslinjeProps { visning: Visning }
export const Tidslinje = ({ visning }: TidslinjeProps) => {
    const { data: sykeforloep } = useSykeforloep()
    const { data: narmesteLedere } = useNarmesteledere()

    const startdato = hentStartdatoFraSykeforloep(sykeforloep)

    const hendelser: Hendelse[] = leggTilTidshendelser(visning, narmesteLedere, startdato)

    const skalViseNyNaermesteLederHendelse = (hendelse: Hendelse) => {
        const ikkeVis = hendelse.type === 'NY_NAERMESTE_LEDER' && visning === 'UTEN_ARBEIDSGIVER'
        return !ikkeVis
    }

    return (
        <div className="tidslinje">
            {
                hendelser
                    .filter(skalViseNyNaermesteLederHendelse)
                    .filter((h) =>
                        h.type !== 'AKTIVITETSKRAV_VARSEL'
                    )
                    .map((hendelse, idx) => {
                        if (hendelse.type === 'BOBLE' || hendelse.type === 'NY_NAERMESTE_LEDER') {
                            return (
                                <HendelseBoble
                                    key={idx}
                                    hendelse={hendelse}
                                />
                            )
                        }
                        return (
                            <HendelseTittel
                                key={idx}
                                tekstkey={hendelse.tekstkey}
                                type={hendelse.type}
                                startdato={startdato}
                            />
                        )
                    })
            }
        </div>
    )
}
