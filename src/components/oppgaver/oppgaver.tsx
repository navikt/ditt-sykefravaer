import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import React from 'react'

import { useAppStore } from '../../data/stores/app-store'
import { RSSoknadstatus } from '../../types/rs-types/rs-soknadstatus'
import { RSSoknadstype } from '../../types/rs-types/rs-soknadstype'
import { Soknad } from '../../types/soknad'
import { Sykmelding } from '../../types/sykmelding'
import environment from '../../utils/environment'
import { tekst } from '../../utils/tekster'


interface Oppgave {
    tekst: string;
    lenke: string;
    type: 'info' | 'advarsel'
}

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

export function skapSøknadOppgaver(soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] {

    const søknaderTilUtfylling = (s: Soknad) => (s.status == RSSoknadstatus.NY || s.status == RSSoknadstatus.UTKAST_TIL_KORRIGERING)

    function skapSykepengesoknadOppgaver(soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] {
        const vanligeSoknader = [ RSSoknadstype.ARBEIDSTAKERE, RSSoknadstype.ARBEIDSLEDIG, RSSoknadstype.ANNET_ARBEIDSFORHOLD, RSSoknadstype.BEHANDLINGSDAGER, RSSoknadstype.SELVSTENDIGE_OG_FRILANSERE, ]

        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => vanligeSoknader.includes(s.soknadstype))
        if (soknadene.length == 0) {
            return []
        }

        if (soknadene.length == 1) {
            return [ {
                tekst: tekst('oppgaver.sykepengesoknad.enkel'),
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[ 0 ].id}`,
                type: 'info'
            } ]
        }
        return [ {
            tekst: tekst('oppgaver.sykepengesoknad.flere', {
                '%ANTALL%': soknadene.length.toString()
            }),
            lenke: sykepengesoknadUrl,
            type: 'info'
        } ]
    }

    function skapReisetilskuddOppgaver(soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] {
        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => s.soknadstype == RSSoknadstype.REISETILSKUDD)
        if (soknadene.length == 0) {
            return []
        }
        if (soknadene.length == 1) {
            return [ {
                tekst: tekst('oppgaver.reisetilskudd.enkel'),
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[ 0 ].id}`,
                type: 'info'
            } ]
        }
        return [ {
            tekst: tekst('oppgaver.reisetilskudd.flere', {
                '%ANTALL%': soknadene.length.toString()
            }),
            lenke: sykepengesoknadUrl,
            type: 'info'
        } ]
    }

    return [ ...skapSykepengesoknadOppgaver(soknader, sykepengesoknadUrl), ...skapReisetilskuddOppgaver(soknader, sykepengesoknadUrl) ]
}


export function skapSykmeldingppgaver(sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] {

    function skapVanligeOppgaver(sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] {

        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent == 'APEN')
            .filter((s) => s.behandlingsutfall.status == 'OK' || s.behandlingsutfall.status == 'MANUAL_PROCESSING')

        if (sykmeldingene.length == 0) {
            return []
        }

        if (sykmeldingene.length == 1) {
            return [ {
                tekst: tekst('oppgaver.sykmeldinger.en-sykmelding'),
                lenke: `${sykmeldingUrl}/soknader/${sykmeldingene[ 0 ].id}`,
                type: 'info'
            } ]
        }
        return [ {
            tekst: tekst('oppgaver.sykmeldinger.flere-sykmeldinger', {
                '%ANTALL%': sykmeldingene.length.toString()
            }),
            lenke: sykmeldingUrl,
            type: 'info',

        } ]
    }

    function skapAvvisteOppgaver(sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] {
        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent == 'APEN')
            .filter((s) => s.behandlingsutfall.status == 'INVALID')

        if (sykmeldingene.length == 0) {
            return []
        }

        if (sykmeldingene.length == 1) {
            return [ {
                tekst: tekst('oppgaver.sykmeldinger.en-avvist-sykmelding'),
                lenke: `${sykmeldingUrl}/soknader/${sykmeldingene[ 0 ].id}`,
                type: 'advarsel',

            } ]
        }
        return [ {
            tekst: tekst('oppgaver.sykmeldinger.flere-avviste-sykmeldinger', {
                '%ANTALL%': sykmeldingene.length.toString()
            }),
            lenke: sykmeldingUrl,
            type: 'advarsel',
        } ]
    }

    return [ ...skapVanligeOppgaver(sykmeldinger, sykmeldingUrl), ...skapAvvisteOppgaver(sykmeldinger, sykmeldingUrl) ]

}


const Oppgaver = () => {

    const { soknader, sykmeldinger } = useAppStore()

    const soknadOppgaver = skapSøknadOppgaver(soknader, environment.sykepengesoknadUrl)
    const sykmeldingOppgaver = skapSykmeldingppgaver(sykmeldinger, environment.sykmeldingUrl)

    return (
        <>
            <OppgaveLista oppgaver={[ ...sykmeldingOppgaver, ...soknadOppgaver ]} />
        </>
    )
}

export default Oppgaver
