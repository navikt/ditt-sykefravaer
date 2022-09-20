import { Accordion, BodyLong, BodyShort, Heading } from '@navikt/ds-react'
import parser from 'html-react-parser'
import React from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
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

    const arbeidsgivere: string[] = finnAktuelleArbeidsgivere(narmesteLedere, sykmeldinger)

    return (
        <Vis
            hvis={arbeidsgivere && arbeidsgivere.length > 0}
            render={() => (
                <>
                    <section className="din-situasjon">
                        <div className="tittel">
                            <img src="/syk/sykefravaer/static/employer.svg" alt="Employer" />
                            <Heading size="small" level="1">
                                {tekst('din-situasjon.tittel.2')}
                            </Heading>
                        </div>
                        {arbeidsgivere.map((orgnummer, idx) => {
                            return (
                                <div key={idx}>
                                    <Arbeidsgiver orgnummer={orgnummer} />
                                </div>
                            )
                        })}
                    </section>
                    <Accordion className="accordion">
                        <Accordion.Item>
                            <Accordion.Header>{tekst('din-situasjon.slik-hjelper-arbeidsgiver')}</Accordion.Header>
                            <Accordion.Content>
                                <BodyLong spacing>
                                    {parser(tekst('din-situasjon.arbeidsgiver-legger-til-rette'))}
                                </BodyLong>
                                <BodyLong spacing>
                                    {parser(tekst('din-situasjon.arbeidsgiver-oppfølgingsplan'))}
                                </BodyLong>
                                <ul>
                                    <li>
                                        <BodyShort spacing>
                                            <strong>{tekst('din-situasjon.arbeidsgiver-arbeidsoppgaver')}</strong>
                                        </BodyShort>
                                    </li>
                                    <li>
                                        <BodyShort spacing>
                                            <strong>{tekst('din-situasjon.arbeidsgiver-tilrettelegging')}</strong>
                                        </BodyShort>
                                    </li>
                                </ul>
                                <BodyLong spacing>
                                    {parser(tekst('din-situasjon.arbeidsgiver-tidlig-oppfølgingsplan'))}
                                </BodyLong>
                                <BodyShort>{parser(tekst('din-situasjon.arbeidsgiver-ansvar-for-møte'))}</BodyShort>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                </>
            )}
        />
    )
}

export default Arbeidssituasjon
