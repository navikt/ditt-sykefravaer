import { BodyShort, Heading, HelpText } from '@navikt/ds-react'
import React from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { ArbeidssituasjonType } from '../../types/arbeidssituasjon'
import {
    hentArbeidssituasjon,
    selectSykmeldingerYngreEnnTreMaaneder,
} from '../../utils/sykmeldingerUtils'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import Arbeidsgiver from './Arbeidsgiver'
import { finnAktuelleArbeidsgivere } from './arbeidssituasjonHjelpefunksjoner'

const Arbeidssituasjon = () => {
    const { data: narmesteLedere } = useNarmesteledere()
    const { data: sykmeldinger } = useSykmeldinger()

    if (!sykmeldinger || !narmesteLedere) {
        return null
    }

    const arbeidsgivere: string[] = finnAktuelleArbeidsgivere(
        narmesteLedere,
        sykmeldinger
    )

    const finnAktuelleArbeidssituasjoner = (
        arbeidsgivere: string[]
    ): string[] => {
        const arbeidssituasjoner = new Set(
            selectSykmeldingerYngreEnnTreMaaneder(sykmeldinger)
                .filter(
                    (s) =>
                        s.behandlingsutfall.status === 'OK' ||
                        s.behandlingsutfall.status === 'MANUAL_PROCESSING'
                )
                .filter(
                    (syk) => syk.sykmeldingStatus.statusEvent === 'BEKREFTET'
                )
                .map((syk) => hentArbeidssituasjon(syk) || '')
                .filter(
                    (arbeidssituasjon) =>
                        !(
                            arbeidssituasjon === 'ARBEIDSTAKER' &&
                            arbeidsgivere.length
                        )
                )
        )
        return Array.from(arbeidssituasjoner)
    }

    const arbeidssituasjoner: string[] =
        finnAktuelleArbeidssituasjoner(arbeidsgivere)

    const arbeidssituasjonTilIkon = (
        arbeidssituasjon: ArbeidssituasjonType
    ) => {
        switch (arbeidssituasjon) {
            case 'ARBEIDSTAKER':
                return '/syk/sykefravaer/static/arbeidsgiver.svg'
            case 'NAERINGSDRIVENDE':
            case 'FRILANSER':
                return '/syk/sykefravaer/static/id-kort.svg'
            default:
                return '/syk/sykefravaer/static/skilt.svg'
        }
    }

    return (
        <Vis
            hvis={
                (arbeidsgivere && arbeidsgivere.length > 0) ||
                (arbeidssituasjoner && arbeidssituasjoner.length > 0)
            }
            render={() => (
                <section className="din-situasjon">
                    <header className="din-situasjon__header">
                        <img
                            src="/syk/sykefravaer/static/arbeidssituasjon.svg"
                            alt="Arbeidssituasjon"
                        />
                        <Heading size="medium" level="2">
                            {tekst('din-situasjon.tittel.2')}
                        </Heading>
                        <HelpText>
                            {tekst('din-situasjon.hjelpetekst.tekst')}
                        </HelpText>
                    </header>
                    <div className="arbeidssituasjon-panel">
                        {arbeidsgivere.map((orgnummer, idx) => {
                            return (
                                <div className="situasjon__panel" key={idx}>
                                    <div className="situasjon__ikon">
                                        <img
                                            src={arbeidssituasjonTilIkon(
                                                'ARBEIDSTAKER'
                                            )}
                                            alt={tekst(
                                                'din-situasjon.ARBEIDSTAKER'
                                            )}
                                        />
                                    </div>
                                    <Arbeidsgiver orgnummer={orgnummer} />
                                </div>
                            )
                        })}
                        {arbeidssituasjoner.map((arbeidssituasjon, idx) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const arbeidssituasjonLedetekst = tekst(
                                `din-situasjon.${arbeidssituasjon}` as any
                            )
                            return (
                                <div className="situasjon__panel" key={idx}>
                                    <div className="situasjon__ikon">
                                        {/* eslint-disable-next-line */}
                                        <img
                                            src={arbeidssituasjonTilIkon(
                                                arbeidssituasjon as any
                                            )}
                                            alt={arbeidssituasjonLedetekst}
                                        />
                                    </div>
                                    <div className="situasjon__innhold">
                                        <BodyShort>
                                            {arbeidssituasjonLedetekst}
                                        </BodyShort>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}
        />
    )
}

export default Arbeidssituasjon
