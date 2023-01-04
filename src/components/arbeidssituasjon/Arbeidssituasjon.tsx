import { Accordion, BodyLong, BodyShort, Heading, HelpText } from '@navikt/ds-react'
import parser from 'html-react-parser'
import React from 'react'

import useNarmesteledere from '../../hooks/useNarmesteledere'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'

import ArbeidsgiverAccordion from './ArbeidsgiverAccordion'
import ArbeidsgiverPanel from './ArbeidsgiverPanel'
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
                        <div className="din-situasjon__header">
                            <div className="del1">
                                <img src="/syk/sykefravaer/static/employer.svg" alt="Employer" />
                                <Heading size="small" level="2">
                                    {tekst('din-situasjon.tittel.2')}
                                </Heading>
                            </div>
                            <HelpText>{tekst('din-situasjon.hjelpetekst.tekst')}</HelpText>
                        </div>
                        <Vis
                            hvis={arbeidsgivere.length === 1}
                            render={() => <ArbeidsgiverPanel orgnummer={arbeidsgivere[0]} />}
                        />
                        <Vis
                            hvis={arbeidsgivere.length > 1}
                            render={() => (
                                <>
                                    {arbeidsgivere.map((orgnummer, idx) => (
                                        <ArbeidsgiverAccordion orgnummer={orgnummer} key={idx} />
                                    ))}
                                </>
                            )}
                        />
                    </section>
                    <Accordion>
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
