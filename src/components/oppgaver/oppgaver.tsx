import Lenke from 'nav-frontend-lenker'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { RSSoknadstatus } from '../../types/rs-types/rs-soknadstatus'
import environment from '../../utils/environment'


interface Oppgave {
    tekst: string;
    lenke: string;
}

interface OppgaveProps {
    oppgaver: Oppgave[];
}


const OppgaveLista = (oppgaveProps: OppgaveProps) => {
    if (oppgaveProps.oppgaver.length == 0) {
        return null
    }
    return (
        <div style={{ border: '1px', borderStyle: 'solid', marginBottom: '2em', padding: '1em' }}>
            <h3>Oppgaver som venter på deg</h3>
            {oppgaveProps.oppgaver.map((v, idx) => {
                return <Lenke key={idx} href={v.lenke}>{v.tekst}</Lenke>
            })}
        </div>
    )

}

const Oppgaver = () => {

    const { soknader } = useAppStore()

    const soknadOppgaver = soknader
        .filter((s) => s.status == RSSoknadstatus.NY) //TODO garra flere som må med
        .map((s) => {
            return {
                tekst: 'Du har en ny sykepengesoknad til utfylling',
                lenke: `${environment.sykepengesoknadUrl}/soknader/${s.id}`
            }
        })

    return (
        <>
            <OppgaveLista oppgaver={soknadOppgaver} />
        </>
    )
}

export default Oppgaver
