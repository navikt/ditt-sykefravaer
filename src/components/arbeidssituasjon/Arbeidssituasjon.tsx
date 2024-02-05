import { Accordion, BodyLong, BodyShort, Heading, Skeleton } from '@navikt/ds-react'
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
    const { data: narmesteLedere, isLoading: nlLaster } = useNarmesteledere()
    const { data: sykmeldinger, isLoading: smLaster } = useSykmeldinger()

    if (nlLaster || smLaster) {
        return (
            <>
                <Skeleton variant="rectangle" height="30px" className="mb-4 mt-8" />
                <Skeleton variant="rectangle" height="170px" />
                <Skeleton variant="rectangle" height="52px" className="mb-2" />
            </>
        )
    }

    if (!sykmeldinger || !narmesteLedere) {
        return null
    }

    const arbeidsgivere: string[] = finnAktuelleArbeidsgivere(narmesteLedere, sykmeldinger)

    return (
        <>
            {arbeidsgivere.length > 0 && (
                <>
                    <section data-cy="din-situasjon">
                        <div className="mx-auto mb-4 mt-8 flex">
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
                    <Accordion>
                        <Accordion.Item>
                            <Accordion.Header>Du har rett til sykepenger til 17.des.2024</Accordion.Header>
                            <Accordion.Content>
                                <BodyLong spacing>Du har nå vært sykmeldt i 30 uker</BodyLong>
                                <BodyLong spacing>
                                    Som ansatt har du rett til sykepenger i opptil 52 uker over en periode på 18
                                    måneder, også kjent som maksdatoen for sykepenger. Når du nærmer deg denne grensen
                                    og fortsatt er syk, vil ikke arbeidsgiveren din lenger få refusjon fra NAV for dine
                                    sykepenger.
                                </BodyLong>
                                <BodyLong spacing>
                                    Ved sykdom utover 52 uker, kan overgang til arbeidsavklaringspenger (AAP) være
                                    aktuelt. Det er viktig å merke seg at sykefravær over de siste tre årene kan legges
                                    sammen hvis det er mindre enn 26 uker mellom fraværene. Etter utløpt maksdato, må
                                    det gå 26 uker uten sykepenger eller AAP før du eventuelt kan motta sykepenger
                                    igjen. Spesielle regler gjelder for personer mellom 67 og 70 år.
                                </BodyLong>
                                <BodyShort>
                                    For mer detaljert informasjon les
                                    <a href="https://www.nav.no/sykepenger#hvor-lenge" target="_blank">
                                        {' '}
                                        syk lenger enn 52 uker.
                                    </a>
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
