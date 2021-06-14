import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import environment from '../../utils/environment'
import { Oppgave } from './oppgave-typer'
import { skapSøknadOppgaver } from './soknad-oppgaver'
import { skapSykmeldingoppgaver } from './sykmelding-oppgaver'

interface OppgaveProps {
    oppgaver: Oppgave[];
}


const OppgaveLista = (oppgaveProps: OppgaveProps) => {
    if (oppgaveProps.oppgaver.length == 0) {
        return null
    }
    return (
        <>
            {oppgaveProps.oppgaver.map((v, idx) => {
                return <div key={idx} style={{ marginBottom: '1em' }}>
                    <Alertstripe type={v.type}><Lenke href={v.lenke}>{v.tekst}</Lenke></Alertstripe>
                </div>
            })}
        </>
    )

}


const Oppgaver = () => {

    const { soknader, sykmeldinger } = useAppStore()

    const soknadOppgaver = skapSøknadOppgaver(soknader, environment.sykepengesoknadUrl)
    const sykmeldingOppgaver = skapSykmeldingoppgaver(sykmeldinger, environment.sykmeldingUrl)

    return (
        <>
            <OppgaveLista oppgaver={[ ...sykmeldingOppgaver, ...soknadOppgaver ]} />
        </>
    )
}

export default Oppgaver
