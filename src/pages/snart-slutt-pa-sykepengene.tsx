import { Back } from '@navikt/ds-icons'
import { Accordion, BodyShort, Button, GuidePanel, Heading, Label } from '@navikt/ds-react'
import parser from 'html-react-parser'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { logEvent } from '../components/amplitude/amplitude'
import { finnAktuelleArbeidsgivere } from '../components/arbeidssituasjon/arbeidssituasjonHjelpefunksjoner'
import Banner from '../components/banner/Banner'
import Bjorn from '../components/bjorn/Bjorn'
import Brodsmuler, { Brodsmule } from '../components/brodsmuler/Brodsmuler'
import Vis from '../components/Vis'
import { dialog } from '../grafikk/Dialog'
import { penger } from '../grafikk/Penger'
import { veilederDame } from '../grafikk/VeilederDame'
import useArbeidsrettetOppfolging from '../query-hooks/useArbeidsrettetOppfolging'
import useNarmesteledere from '../query-hooks/useNarmesteledere'
import useSykmeldinger from '../query-hooks/useSykmeldinger'
import { arbeidssokerregistreringUrl } from '../utils/environment'
import { setBodyClass } from '../utils/setBodyClass'
import { tekst } from '../utils/tekster'

const brodsmuler: Brodsmule[] = [
    {
        tittel: 'Snart slutt på sykepengene',
        sti: '/snart-slutt-pa-sykepengene',
        erKlikkbar: false,
    },
]

const SnartSluttPaSykepengene = () => {
    const router = useRouter()
    const [ harArbeidsgiver, setHarArbeidsgiver ] = useState<boolean>()
    const [ arbeidsrettetOppfolging, setArbeidsrettetOppfolging ] = useState<any>()

    const { data: oppfolging } = useArbeidsrettetOppfolging()
    const { data: narmesteLedere } = useNarmesteledere()
    const { data: sykmeldinger } = useSykmeldinger()

    useEffect(() => {
        setBodyClass('snartslutt')

        const arbeidsgivere = finnAktuelleArbeidsgivere(
            narmesteLedere,
            sykmeldinger
        )
        setHarArbeidsgiver(arbeidsgivere.length > 0)
        setArbeidsrettetOppfolging(oppfolging)
    }, [ narmesteLedere, oppfolging, sykmeldinger ])

    const logSvar = (svar: 'JA' | 'NEI') => {
        logEvent('Spørsmål svart', {
            sporsmal: tekst('snartslutt.veiledning'),
            svar,
        })
    }

    const handleJaBtnClicked = () => {
        logSvar('JA')
        // Må sikre at amplitude får logget ferdig
        window.setTimeout(() => {
            window.location.href = arbeidssokerregistreringUrl()
        }, 200)
    }

    const handleNeiBtnClicked = () => {
        logSvar('NEI')
        router.push('/')
    }

    return (
        <>
            <Banner>
                <Heading size="xlarge" level="1" className="sidebanner__tittel">
                    {tekst('sidetittel.snartslutt')}
                </Heading>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <Bjorn>
                    <BodyShort>{tekst('snartslutt.bjorntekst')}</BodyShort>
                </Bjorn>

                <Heading size="medium" level="2" className="subtittel">
                    {tekst('snartslutt.hva_nå')}
                </Heading>

                <Vis hvis={harArbeidsgiver}
                    render={() => (
                        <GuidePanel illustration={veilederDame}>
                            <Label as="h3">
                                {tekst('snartslutt.snakk_med.tittel')}
                            </Label>
                            <BodyShort>
                                {tekst('snartslutt.snakk_med.tekst')}
                            </BodyShort>
                        </GuidePanel>
                    )}
                />

                <Vis hvis={!harArbeidsgiver}
                    render={() => (
                        <GuidePanel illustration={dialog}>
                            <Label as="h3">
                                {tekst('snartslutt.aktivitetsplan.tittel')}
                            </Label>
                            <BodyShort>
                                {tekst('snartslutt.aktivitetsplan.tekst')}
                            </BodyShort>
                        </GuidePanel>
                    )}
                />

                <GuidePanel illustration={penger}>
                    <Label as="h3">
                        {tekst('snartslutt.planlegg.tittel')}
                    </Label>
                    <BodyShort>
                        {tekst('snartslutt.planlegg.tekst')}
                    </BodyShort>
                </GuidePanel>

                <Heading size="medium" level="2" className="subtittel">
                    {tekst('snartslutt.andre')}
                </Heading>

                <Accordion>
                    <Accordion.Item className="byttjobb">
                        <Accordion.Header>
                            <Vis hvis={harArbeidsgiver}
                                render={() => (
                                    <Heading size="small" level="3">
                                        {tekst('snartslutt.bytt_jobb.tittel')}
                                    </Heading>
                                )}
                            />
                            <Vis hvis={!harArbeidsgiver}
                                render={() => (
                                    <Heading size="small" level="3">
                                        {tekst('snartslutt.finn_jobb.tittel')}
                                    </Heading>
                                )}
                            />
                        </Accordion.Header>

                        <Accordion.Content>
                            <ul>
                                <BodyShort as="li">
                                    {parser(tekst('snartslutt.bytt_jobb.liste.del1'))}
                                </BodyShort>
                                <BodyShort as="li">
                                    {parser(tekst('snartslutt.bytt_jobb.liste.del2'))}
                                </BodyShort>
                            </ul>
                        </Accordion.Content>
                    </Accordion.Item>

                    <Accordion.Item className="okonomien">
                        <Accordion.Header>
                            <Heading size="small" level="3">
                                {tekst('snartslutt.okonomien.tittel')}
                            </Heading>
                        </Accordion.Header>

                        <Accordion.Content>
                            <Vis hvis={harArbeidsgiver}
                                render={() => (
                                    <BodyShort>
                                        {tekst('snartslutt.okonomien.tekst')}
                                    </BodyShort>
                                )}
                            />
                            <Vis hvis={!harArbeidsgiver}
                                render={() => (
                                    <BodyShort>
                                        {tekst('snartslutt.okonomien.tekst2')}
                                    </BodyShort>
                                )}
                            />
                            <Vis hvis={harArbeidsgiver}
                                render={() => (
                                    <BodyShort>
                                        {tekst('snartslutt.okonomien.innhold.avsnitt1')}
                                    </BodyShort>
                                )}
                            />
                            <BodyShort>
                                {parser(tekst('snartslutt.okonomien.innhold.avsnitt2'))}
                            </BodyShort>
                            <BodyShort>
                                {tekst('snartslutt.okonomien.innhold.avsnitt3')}
                            </BodyShort>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>

                <Vis
                    hvis={arbeidsrettetOppfolging?.underOppfolging === false}
                    render={() => (
                        <>
                            <Heading size="medium" level="2" className="subtittel">
                                {tekst('snartslutt.veiledning')}
                            </Heading>

                            <div className="knapperad">
                                <Button variant="primary" onClick={handleJaBtnClicked}>
                                    {tekst('snartslutt.veiledning.ja')}
                                </Button>
                                <Button onClick={handleNeiBtnClicked}>
                                    {tekst('snartslutt.veiledning.nei')}
                                </Button>
                            </div>
                        </>
                    )}
                />

                <Link href="/">
                    <a className="navds-link"
                        onClick={(e) => {
                            e.preventDefault()
                            router.push('/')
                        }}
                    >
                        <Back className="tilbake-pil" />
                        <BodyShort as="span">
                            Til hovedsiden Ditt sykefravaer
                        </BodyShort>
                    </a>
                </Link>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async() => {
    // Disable static rendring
    return {
        props: {},
    }
}

export default SnartSluttPaSykepengene
