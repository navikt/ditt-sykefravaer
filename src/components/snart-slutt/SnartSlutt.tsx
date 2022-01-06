import parser from 'html-react-parser'
import { VenstreChevron } from 'nav-frontend-chevron'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import { Hovedknapp, Knapp } from 'nav-frontend-knapper'
import { Element, Normaltekst, Sidetittel, Systemtittel } from 'nav-frontend-typografi'
import Veilederpanel from 'nav-frontend-veilederpanel'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { dialog } from '../../grafikk/Dialog'
import { penger } from '../../grafikk/Penger'
import { veilederDame } from '../../grafikk/VeilederDame'
import useArbeidsrettetOppfolging from '../../query-hooks/useArbeidsrettetOppfolging'
import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { arbeidssokerregistreringUrl } from '../../utils/environment'
import setBodyClass from '../../utils/setBodyClass'
import { tekst } from '../../utils/tekster'
import { logEvent } from '../amplitude/amplitude'
import { finnAktuelleArbeidsgivere } from '../arbeidssituasjon/arbeidssituasjonHjelpefunksjoner'
import Banner from '../banner/Banner'
import Bjorn from '../bjorn/Bjorn'
import Brodsmuler, { Brodsmule } from '../brodsmuler/Brodsmuler'
import Vis from '../Vis'

const brodsmuler: Brodsmule[] = [
    { tittel: 'Snart slutt på sykepengene', sti: '/snart-slutt-pa-sykepengene', erKlikkbar: false }
]

const SnartSlutt = () => {
    const history = useHistory()
    const { data: arbeidsrettetOppfolging } = useArbeidsrettetOppfolging()
    const { data: narmesteLedere } = useNarmesteledere()
    const { data: sykmeldinger } = useSykmeldinger()
    const harArbeidgiver = finnAktuelleArbeidsgivere(
        narmesteLedere,
        sykmeldinger
    ).length > 0

    useEffect(() => {
        setBodyClass('snartslutt')
    }, [])

    const logSvar = (svar: 'JA' | 'NEI') => {
        logEvent('Spørsmål svart',
            {
                sporsmal: tekst('snartslutt.veiledning'),
                svar
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
        history.push('/')
    }


    return (
        <div>
            <Banner>
                <Sidetittel className="sidebanner__tittel">
                    {tekst('sidetittel.snartslutt')}
                </Sidetittel>
            </Banner>

            <Brodsmuler brodsmuler={brodsmuler} />

            <div className="limit">
                <Bjorn>
                    <Normaltekst>{tekst('snartslutt.bjorntekst')}</Normaltekst>
                </Bjorn>

                <Systemtittel tag="h2" className="subtittel">
                    {tekst('snartslutt.hva_nå')}
                </Systemtittel>

                <Vis hvis={harArbeidgiver}
                    render={() =>
                        <Veilederpanel svg={veilederDame}>
                            <Element tag="h3">
                                {tekst('snartslutt.snakk_med.tittel')}
                            </Element>
                            <Normaltekst>
                                {tekst('snartslutt.snakk_med.tekst')}
                            </Normaltekst>
                        </Veilederpanel>
                    }
                />

                <Vis hvis={!harArbeidgiver}
                    render={() =>
                        <Veilederpanel svg={dialog}>
                            <Element tag="h3">
                                {tekst('snartslutt.aktivitetsplan.tittel')}
                            </Element>
                            <Normaltekst>
                                {tekst('snartslutt.aktivitetsplan.tekst')}
                            </Normaltekst>
                        </Veilederpanel>
                    }
                />

                <Veilederpanel svg={penger}>
                    <Element tag="h3">
                        {tekst('snartslutt.planlegg.tittel')}
                    </Element>
                    <Normaltekst>
                        {tekst('snartslutt.planlegg.tekst')}
                    </Normaltekst>
                </Veilederpanel>

                <Systemtittel tag="h2" className="subtittel">
                    {tekst('snartslutt.andre')}
                </Systemtittel>

                <Ekspanderbartpanel className="byttjobb"
                    tittel={
                        <>
                            <Vis hvis={harArbeidgiver}
                                render={() =>
                                    <Systemtittel tag="h3">
                                        {tekst('snartslutt.bytt_jobb.tittel')}
                                    </Systemtittel>
                                }
                            />
                            <Vis hvis={!harArbeidgiver}
                                render={() =>
                                    <Systemtittel tag="h3">
                                        {tekst('snartslutt.finn_jobb.tittel')}
                                    </Systemtittel>
                                }
                            />
                        </>
                    }>
                    <ul>
                        <Normaltekst tag="li">
                            {parser(tekst('snartslutt.bytt_jobb.liste.del1'))}
                        </Normaltekst>
                        <Normaltekst tag="li">
                            {parser(tekst('snartslutt.bytt_jobb.liste.del2'))}
                        </Normaltekst>
                    </ul>
                </Ekspanderbartpanel>

                <Ekspanderbartpanel className="okonomien" tittel={
                    <>
                        <Systemtittel tag="h3">
                            {tekst('snartslutt.okonomien.tittel')}
                        </Systemtittel>
                        <Vis hvis={harArbeidgiver}
                            render={() =>
                                <Normaltekst>
                                    {tekst('snartslutt.okonomien.tekst')}
                                </Normaltekst>
                            }
                        />
                        <Vis hvis={!harArbeidgiver}
                            render={() =>
                                <Normaltekst>
                                    {tekst('snartslutt.okonomien.tekst2')}
                                </Normaltekst>
                            }
                        />
                    </>
                }>
                    <Vis hvis={harArbeidgiver}
                        render={() =>
                            <Normaltekst>
                                {tekst('snartslutt.okonomien.innhold.avsnitt1')}
                            </Normaltekst>
                        }
                    />
                    <Normaltekst>
                        {parser(tekst('snartslutt.okonomien.innhold.avsnitt2'))}
                    </Normaltekst>
                    <Normaltekst>
                        {tekst('snartslutt.okonomien.innhold.avsnitt3')}
                    </Normaltekst>
                </Ekspanderbartpanel>


                <Vis hvis={arbeidsrettetOppfolging?.underOppfolging === false}
                    render={() =>
                        <>
                            <Systemtittel tag="h2" className="subtittel">
                                {tekst('snartslutt.veiledning')}
                            </Systemtittel>

                            <div className="knapperad">
                                <Hovedknapp onClick={handleJaBtnClicked}>
                                    {tekst('snartslutt.veiledning.ja')}
                                </Hovedknapp>
                                <Knapp onClick={handleNeiBtnClicked}>
                                    {tekst('snartslutt.veiledning.nei')}
                                </Knapp>
                            </div>
                        </>
                    }
                />

                <Link to="/" className="ekstra-topp-margin lenke">
                    <VenstreChevron />
                    <Normaltekst tag="span">Til hovedsiden Ditt sykefravaer</Normaltekst>
                </Link>
            </div>
        </div>
    )
}

export default SnartSlutt
