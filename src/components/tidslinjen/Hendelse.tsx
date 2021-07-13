import dayjs from 'dayjs'
import parser from 'html-react-parser'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Normaltekst } from 'nav-frontend-typografi'
import React from 'react'

import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { Hendelse, HendelseType } from '../../types/hendelse'
import { Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import { hendelseIkon, tidslinjeIkon } from './tidslinjenUtils'

interface HendelseTittelProps {
    tekstkey: string,
    type: HendelseType,
    startdato?: dayjs.Dayjs
}

export const HendelseTittel = ({ tekstkey, type, startdato }: HendelseTittelProps) => {

    const titteltekst = tekst(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        tekstkey as any, { '%DATO%': startdato ? startdato.format('D. MMMM YYYY') : '' }
    )

    return (
        <div className="tidslinjeHendelse tidslinjeHendelse__rad">
            <div className="tidslinjeHendelse__ikon">
                <img src={tidslinjeIkon(type)} alt="" />
            </div>
            <Normaltekst className="tidslinjeHendelse__tittel">
                {titteltekst}
            </Normaltekst>
        </div>
    )
}

interface HendelseBobleProp {
    hendelse: Hendelse
}

export const HendelseBoble = ({ hendelse }: HendelseBobleProp) => {
    const { data: sykmeldinger } = useSykmeldinger()

    const finnOrgNavn = (org?: string, sykmeldinger?: Sykmelding[]) => {
        if (!org) return undefined

        return sykmeldinger
            ?.find((syk) =>
                syk.sykmeldingStatus.arbeidsgiver?.orgnummer === org &&
                syk.sykmeldingStatus.arbeidsgiver?.orgNavn
            )
            ?.sykmeldingStatus.arbeidsgiver?.orgNavn
    }

    const getTittel = (hendelse: Hendelse) => {
        switch (hendelse.type) {
            case 'AKTIVITETSKRAV_VARSEL':
                return <Normaltekst>{// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parser(tekst(`${hendelse.tekstkey}.tittel` as any, {
                        '%DATO%': hendelse.inntruffetdato
                            ? dayjs(hendelse.inntruffetdato).format('D. MMMM YYYY')
                            : '',
                    }))
                }</Normaltekst>

            case 'NY_NAERMESTE_LEDER':
                return <Normaltekst>{// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parser(tekst(`${hendelse.tekstkey}.tittel` as any, {
                        '%DATO%': hendelse.inntruffetdato
                            ? dayjs(hendelse.inntruffetdato).format('D. MMMM YYYY')
                            : '',
                        '%ARBEIDSGIVER%': finnOrgNavn(hendelse.data?.naermesteLeder.orgnummer, sykmeldinger) || '',
                        '%NAERMESTELEDER%': hendelse.data?.naermesteLeder.navn || '',
                    }))
                }</Normaltekst>
            default:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return <Normaltekst>{tekst(`${hendelse.tekstkey}.tittel` as any)}</Normaltekst>
        }
    }

    const getBudskap = (hendelse: Hendelse) => {
        if (hendelse.type === 'NY_NAERMESTE_LEDER') {
            const aktivTom = hendelse.data?.naermesteLeder.aktivTom

            return <Normaltekst>
                {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parser(tekst(`${hendelse.tekstkey}.budskap` as any, {
                        '%NAVN%': hendelse.data?.naermesteLeder.navn || '',
                        '%STATUS%': aktivTom ? `opphørt den ${dayjs(aktivTom).format('D. MMMM YYYY')}` : 'aktiv',
                    }))
                }
            </Normaltekst>
        }

        return <Normaltekst>
            {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                parser(tekst(`${hendelse.tekstkey}.budskap` as any))
            }
        </Normaltekst>
    }

    return (
        <div className="tidslinjeHendelse tidslinjeHendelse__rad">
            <div className="tidslinjeHendelse__ikon">
                <img src={tidslinjeIkon(hendelse.type)} alt="" />
            </div>
            <Ekspanderbartpanel
                className="tidslinjeHendelse__innhold"
                tittel={getTittel(hendelse)}
            >
                <img alt="" src={hendelseIkon(hendelse)} />
                {getBudskap(hendelse)}
            </Ekspanderbartpanel>
        </div>
    )
}
