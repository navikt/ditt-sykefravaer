import dayjs from 'dayjs'
import parser from 'html-react-parser'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Normaltekst } from 'nav-frontend-typografi'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { Hendelse, HendelseType } from '../../types/hendelse'
import { Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
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

    const erStart = tekstkey === 'tidslinje.sykefravaeret-starter' || tekstkey === 'tidslinje.forste-sykmeldingsdag'
    let className = 'rad'
    if (erStart) {
        type = 'FØRSTE_SYKMELDINGSDAG'
        className = 'rad start'
    } else if (type === 'TID') {
        className = 'rad tid'
    }

    return (
        <div className={className}>
            <div className="ikon">
                <Image src={tidslinjeIkon(type)} alt="" width={24} height={24} />
            </div>
            <Normaltekst tag="h3" className="tittel">
                {titteltekst}
            </Normaltekst>
        </div>
    )
}

interface HendelseBobleProp {
    hendelse: Hendelse
}

export const HendelseBoble = ({ hendelse }: HendelseBobleProp) => {
    const [ meldinger, setMeldinger ] = useState<Sykmelding[]>([])
    const { data: sykmeldinger } = useSykmeldinger()

    useEffect(() => {
        setMeldinger(sykmeldinger!)
    }, [ sykmeldinger ])

    const finnOrgNavn = (org?: string, meldinger?: Sykmelding[]) => {
        if (!org) return undefined

        return meldinger
            ?.find((syk) =>
                syk.sykmeldingStatus.arbeidsgiver?.orgnummer === org &&
                syk.sykmeldingStatus.arbeidsgiver?.orgNavn
            )
            ?.sykmeldingStatus.arbeidsgiver?.orgNavn
    }

    const getTittel = (hendelse: Hendelse) => {
        switch (hendelse.type) {
            case 'AKTIVITETSKRAV_VARSEL':
                return <Normaltekst tag="div">{// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parser(tekst(`${hendelse.tekstkey}.tittel` as any, {
                        '%DATO%': hendelse.inntruffetdato
                            ? dayjs(hendelse.inntruffetdato).format('D. MMMM YYYY')
                            : '',
                    }))
                }</Normaltekst>

            case 'NY_NAERMESTE_LEDER':
                return <Normaltekst tag="div">{// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parser(tekst(`${hendelse.tekstkey}.tittel` as any, {
                        '%DATO%': hendelse.inntruffetdato
                            ? dayjs(hendelse.inntruffetdato).format('D. MMMM YYYY')
                            : '',
                        '%ARBEIDSGIVER%': finnOrgNavn(hendelse.data?.naermesteLeder.orgnummer, meldinger) || '',
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

            return <Normaltekst tag="div">{// eslint-disable-next-line @typescript-eslint/no-explicit-any
                parser(tekst(`${hendelse.tekstkey}.budskap` as any, {
                    '%NAVN%': hendelse.data?.naermesteLeder.navn || '',
                    '%STATUS%': aktivTom ? `opphørt den ${dayjs(aktivTom).format('D. MMMM YYYY')}` : 'aktiv',
                }))
            }
            </Normaltekst>
        }

        return (
            <Normaltekst tag="div">
                {parser(tekst(`${hendelse.tekstkey}.budskap` as any))}
            </Normaltekst>
        )
    }

    const hendelseIkonet = hendelseIkon(hendelse)
    return (
        <div className="rad">
            <div className="ikon">
                <Image src={tidslinjeIkon(hendelse.type)} alt="" width={24} height={24} />
            </div>
            <Ekspanderbartpanel tittel={getTittel(hendelse)}>
                <Vis hvis={hendelseIkonet} render={() => <Image alt="" src={hendelseIkonet!} width={240} height={200} /> //TODO størrelsen!!
                } />
                {getBudskap(hendelse)}
            </Ekspanderbartpanel>
        </div>
    )
}
