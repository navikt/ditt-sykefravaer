import Lenke from 'nav-frontend-lenker'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { RSSoknadstatus } from '../../types/rs-types/rs-soknadstatus'
import { RSSoknadstype } from '../../types/rs-types/rs-soknadstype'
import { Soknad } from '../../types/soknad'
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
                return <>
                    <Lenke key={idx} href={v.lenke}>{v.tekst}</Lenke>
                    <br />
                </>
            })}
        </div>
    )

}

export function skapSøknadOppgaver(soknader: Soknad[], sykepengesoknadUrl: string) {

    const søknaderTilUtfylling = (s: Soknad) => (s.status == RSSoknadstatus.NY || s.status == RSSoknadstatus.UTKAST_TIL_KORRIGERING)

    function skapSykepengesoknadOppgaver(soknader: Soknad[], sykepengesoknadUrl: string) {
        const vanligeSoknader = [ RSSoknadstype.ARBEIDSTAKERE, RSSoknadstype.ARBEIDSLEDIG, RSSoknadstype.ANNET_ARBEIDSFORHOLD, RSSoknadstype.BEHANDLINGSDAGER, RSSoknadstype.SELVSTENDIGE_OG_FRILANSERE, ]

        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => vanligeSoknader.includes(s.soknadstype))
        if (soknadene.length == 0) {
            return []
        }

        if (soknadene.length == 1) {
            return [ {
                tekst: 'Du har 1 ny søknad om sykepenger',
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[ 0 ].id}`
            } ]
        }
        return [ {
            tekst: `Du har ${soknadene.length} nye søknader om sykepenger`,
            lenke: `${sykepengesoknadUrl}`
        } ]
    }

    function skapReisetilskuddOppgaver(soknader: Soknad[], sykepengesoknadUrl: string) {
        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => s.soknadstype == RSSoknadstype.REISETILSKUDD)
        if (soknadene.length == 0) {
            return []
        }
        if (soknadene.length == 1) {
            return [ {
                tekst: 'Du har 1 ny søknad om reisetilskudd',
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[ 0 ].id}`
            } ]
        }
        return [ {
            tekst: `Du har ${soknadene.length} nye søknader om reisetilskudd`,
            lenke: `${sykepengesoknadUrl}`
        } ]
    }

    return [ ...skapSykepengesoknadOppgaver(soknader, sykepengesoknadUrl), ...skapReisetilskuddOppgaver(soknader, sykepengesoknadUrl) ]
}

const Oppgaver = () => {

    const { soknader, sykmeldinger } = useAppStore()

    const soknadOppgaver = skapSøknadOppgaver(soknader, environment.sykepengesoknadUrl)

    const sykmeldingOppgaver = sykmeldinger
        .filter((s) => s.sykmeldingStatus.statusEvent == 'APEN') //TODO garra flere som må med. Håndter når flere
        .map((s) => {
            return {
                tekst: 'Du har en ny sykmelding',
                lenke: `${environment.sykmeldingUrl}/${s.id}`
            }
        })


    return (
        <>
            <OppgaveLista oppgaver={[ ...sykmeldingOppgaver, ...soknadOppgaver ]} />
        </>
    )
}

export default Oppgaver
