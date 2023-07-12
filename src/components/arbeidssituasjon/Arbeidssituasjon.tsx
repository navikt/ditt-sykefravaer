import { Accordion, BodyLong, BodyShort, Heading } from '@navikt/ds-react'
import React from 'react'
import { Buldings2Icon } from '@navikt/aksel-icons'

import { parserWithReplace } from '../../utils/html-react-parser-utils'
import useNarmesteledere from '../../hooks/useNarmesteledere'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'

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
        <>
            {' '}
            {arbeidsgivere.length > 0 && (
                <>
                    <section data-cy="din-situasjon">
                        <div className="mx-auto mb-4 mt-0 flex py-1 pt-6 ">
                            <Buldings2Icon title="Employer" width="30px" height="30px" className="mr-1" />
                            <Heading size="small" level="2">
                                {tekst('din-situasjon.tittel.2')}
                            </Heading>
                        </div>
                        {arbeidsgivere.length === 1 && <ArbeidsgiverPanel orgnummer={arbeidsgivere[0]} />}

                        {arbeidsgivere.length > 1 && (
                            <>
                                {arbeidsgivere.map((orgnummer, idx) => (
                                    <ArbeidsgiverAccordion orgnummer={orgnummer} key={idx} />
                                ))}
                            </>
                        )}
                    </section>
                    <Accordion>
                        <Accordion.Item>
                            <Accordion.Header>{tekst('din-situasjon.slik-hjelper-arbeidsgiver')}</Accordion.Header>
                            <Accordion.Content>
                                <BodyLong spacing>
                                    {parserWithReplace(tekst('din-situasjon.arbeidsgiver-legger-til-rette'))}
                                </BodyLong>
                                <BodyLong spacing>
                                    {parserWithReplace(tekst('din-situasjon.arbeidsgiver-oppfølgingsplan'))}
                                </BodyLong>
                                <ul>
                                    <BodyShort as="li" spacing>
                                        <strong>{tekst('din-situasjon.arbeidsgiver-arbeidsoppgaver')}</strong>
                                    </BodyShort>

                                    <BodyShort as="li" spacing>
                                        <strong>{tekst('din-situasjon.arbeidsgiver-tilrettelegging')}</strong>
                                    </BodyShort>
                                </ul>
                                <BodyLong spacing>
                                    {parserWithReplace(tekst('din-situasjon.arbeidsgiver-tidlig-oppfølgingsplan'))}
                                </BodyLong>
                                <BodyShort>
                                    {parserWithReplace(tekst('din-situasjon.arbeidsgiver-ansvar-for-møte'))}
                                </BodyShort>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                </>
            )}
        </>
    )
}

export default Arbeidssituasjon
