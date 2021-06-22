import './oppgaver.less'

import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'

import use39ukersvarsel from '../../query-hooks/use39ukersvarsel'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import environment from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgave-typer'
import { skapSøknadOppgaver } from './soknad-oppgaver'
import { skapSykmeldingoppgaver } from './sykmelding-oppgaver'

interface OppgaveProps {
    oppgaver: Oppgave[];
}

const OppgaveLista = (oppgaveProps: OppgaveProps) => {
    if (oppgaveProps.oppgaver.length === 0) {
        return null
    }

    return (
        <section className="oppgaver">
            <Systemtittel tag="h2">Oppgaver</Systemtittel>
            {oppgaveProps.oppgaver.map((v, idx) => {
                return (
                    <Alertstripe type={v.oppgavetype} key={idx}>
                        <Lenke href={v.lenke}>{v.tekst}</Lenke>
                    </Alertstripe>
                )
            })}
        </section>
    )
}

const Oppgaver = () => {
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()
    const { data: snartSluttPaSykepengene } = use39ukersvarsel()

    const soknadOppgaver = skapSøknadOppgaver(soknader, environment.sykepengesoknadUrl)
    const sykmeldingOppgaver = skapSykmeldingoppgaver(sykmeldinger, environment.sykmeldingUrl)

    const oppgaver = [ ...sykmeldingOppgaver, ...soknadOppgaver ]
    if (snartSluttPaSykepengene) {
        oppgaver.push({
            tekst: tekst('oppgaver.snartslutt'),
            lenke: tekst('oppgaver.snartslutt.url'),
            oppgavetype: 'advarsel'
        })
    }

    return (
        <OppgaveLista oppgaver={oppgaver} />
    )
}

export default Oppgaver
