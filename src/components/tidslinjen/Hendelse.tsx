import { Accordion, BodyShort, Heading } from '@navikt/ds-react'
import dayjs from 'dayjs'
import parser from 'html-react-parser'
import React, { useEffect, useState } from 'react'

import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { Hendelse, HendelseType } from '../../types/hendelse'
import { Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import { hendelseIkon, tidslinjeIkon } from './tidslinjenUtils'

interface HendelseTittelProps {
    tekstkey: string
    type: HendelseType
    startdato?: dayjs.Dayjs
}

export const HendelseTittel = ({
    tekstkey,
    type,
    startdato,
}: HendelseTittelProps) => {
    const titteltekst = tekst(
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        tekstkey as any,
        { '%DATO%': startdato ? startdato.format('D. MMMM YYYY') : '' }
    )

    const erStart =
        tekstkey === 'tidslinje.sykefravaeret-starter' ||
        tekstkey === 'tidslinje.forste-sykmeldingsdag'
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
                <img src={tidslinjeIkon(type)} alt="" />
            </div>
            <Heading size="small" level="3" className="tittel">
                {titteltekst}
            </Heading>
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

        return meldinger?.find(
            (syk) =>
                syk.sykmeldingStatus.arbeidsgiver?.orgnummer === org &&
                syk.sykmeldingStatus.arbeidsgiver?.orgNavn
        )?.sykmeldingStatus.arbeidsgiver?.orgNavn
    }

    const getTittel = (hendelse: Hendelse) => {
        switch (hendelse.type) {
            case 'AKTIVITETSKRAV_VARSEL':
                return (
                    <BodyShort as="div">
                        {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            parser(
                                tekst(`${hendelse.tekstkey}.tittel` as any, {
                                    '%DATO%': hendelse.inntruffetdato
                                        ? dayjs(hendelse.inntruffetdato).format(
                                            'D. MMMM YYYY'
                                        )
                                        : '',
                                })
                            )
                        }
                    </BodyShort>
                )

            case 'NY_NAERMESTE_LEDER':
                return (
                    <BodyShort as="div">
                        {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            parser(
                                tekst(`${hendelse.tekstkey}.tittel` as any, {
                                    '%DATO%': hendelse.inntruffetdato
                                        ? dayjs(hendelse.inntruffetdato).format(
                                            'D. MMMM YYYY'
                                        )
                                        : '',
                                    '%ARBEIDSGIVER%':
                                        finnOrgNavn(
                                            hendelse.data?.naermesteLeder
                                                .orgnummer,
                                            meldinger
                                        ) || '',
                                    '%NAERMESTELEDER%':
                                        hendelse.data?.naermesteLeder.navn ||
                                        '',
                                })
                            )
                        }
                    </BodyShort>
                )
            default:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (
                    <BodyShort>
                        {tekst(`${hendelse.tekstkey}.tittel` as any)}
                    </BodyShort>
                )
        }
    }

    const getBudskap = (hendelse: Hendelse) => {
        if (hendelse.type === 'NY_NAERMESTE_LEDER') {
            const aktivTom = hendelse.data?.naermesteLeder.aktivTom

            return (
                <BodyShort as="div">
                    {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        parser(
                            tekst(`${hendelse.tekstkey}.budskap` as any, {
                                '%NAVN%':
                                    hendelse.data?.naermesteLeder.navn || '',
                                '%STATUS%': aktivTom
                                    ? `opphørt den ${dayjs(aktivTom).format(
                                        'D. MMMM YYYY'
                                    )}`
                                    : 'aktiv',
                            })
                        )
                    }
                </BodyShort>
            )
        }

        return (
            <BodyShort as="div">
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parser(tekst(`${hendelse.tekstkey}.budskap` as any))
                }
            </BodyShort>
        )
    }

    return (
        <div className="rad">
            <div className="ikon">
                <img src={tidslinjeIkon(hendelse.type)} alt="" />
            </div>
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>{getTittel(hendelse)}</Accordion.Header>
                    <Accordion.Content>
                        <img alt="" src={hendelseIkon(hendelse)} />
                        {getBudskap(hendelse)}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
            <Accordion>
                <Accordion.Item>
                    <Accordion.Header>
                        {getTittel(hendelse)}
                    </Accordion.Header>
                    <Accordion.Content>
                        <img alt="" src={hendelseIkon(hendelse)} />
                        {getBudskap(hendelse)}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}
