import { Accordion, BodyLong, BodyShort, Heading, Panel } from '@navikt/ds-react'
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
                <section className="din-situasjon">
                    <div className="tittel">
                        <img src="/syk/sykefravaer/static/employer.svg" alt="Employer" />
                        <Heading size="medium">{tekst('din-situasjon.tittel.2')}</Heading>
                    </div>
                    <Panel className="bakgrunn">
                        <div>
                            {arbeidsgivere.map((orgnummer, idx) => {
                                return (
                                    <div className="situasjon__panel" key={idx}>
                                        <Arbeidsgiver orgnummer={orgnummer} />
                                    </div>
                                )
                            })}
                        </div>
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
                                    <BodyLong spacing>
                                        {tekst('din-situasjon.arbeidsgiver-noen-arbeidsoppgaver')}
                                    </BodyLong>
                                    <BodyLong spacing>
                                        {parser(tekst('din-situasjon.arbeidsgiver-tidlig-oppfølgingsplan'))}
                                    </BodyLong>
                                    <BodyShort>{tekst('din-situasjon.arbeidsgiver-ansvar-for-møte')}</BodyShort>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion>
                    </Panel>
                </section>
            )}
        />
    )
}

export default Arbeidssituasjon
