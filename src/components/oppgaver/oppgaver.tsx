import './oppgaver.less'

import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
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
    const { soknader, sykmeldinger } = useAppStore()
    const soknadOppgaver = skapSøknadOppgaver(soknader, environment.sykepengesoknadUrl)
    const sykmeldingOppgaver = skapSykmeldingoppgaver(sykmeldinger, environment.sykmeldingUrl)
    const snartSluttOppgaver: Oppgave[] = [ {
        tekst: tekst('oppgaver.snartslutt'),
        lenke: tekst('oppgaver.snartslutt.url'),
        oppgavetype: 'advarsel'
    } ]

    return (
        <OppgaveLista oppgaver={[ ...sykmeldingOppgaver, ...soknadOppgaver, ...snartSluttOppgaver ]} />
    )
}

export default Oppgaver
