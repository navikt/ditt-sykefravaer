import './oppgaver.less'

import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'

import { getAktivitetskravvisning, NYTT_AKTIVITETSKRAVVARSEL } from '../../pages/aktivitetskrav/AktivitetskravVarsel'
import use39ukersvarsel from '../../query-hooks/use39ukersvarsel'
import useBrev from '../../query-hooks/useBrev'
import useDialogmoteBehov from '../../query-hooks/useDialogmoteBehov'
import useDialogmoter from '../../query-hooks/useDialogmoter'
import useHendelser from '../../query-hooks/useHendelser'
import useOppfolgingsplaner from '../../query-hooks/useOppfolgingsplaner'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import env from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { skapBrevOppgaver } from './brevOppgaver'
import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'
import { skapDialogmoteSvarOppgaver } from './dialogmoteOppgaver'
import { skapOppfolgingsplanOppgaver } from './oppfolgingsplanOppgaver'
import { Oppgave } from './oppgaveTyper'
import { skapSøknadOppgaver } from './soknadOppgaver'
import { skapSykmeldingoppgaver } from './sykmeldingOppgaver'

interface OppgaveProps {
    oppgaver: Oppgave[];
}

const OppgaveLista = (oppgaveProps: OppgaveProps) => {
    if (oppgaveProps.oppgaver.length === 0) {
        return null
    }

    return (
        <section className="oppgaver">
            <Systemtittel tag="h2" className={'hide-element'}>Oppgaver</Systemtittel>
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
    const { data: oppfolgingsplaner } = useOppfolgingsplaner()
    const { data: dialogmoteBehov } = useDialogmoteBehov()
    const { data: dialogmoteSvar } = useDialogmoter()
    const { data: brev } = useBrev()
    const { data: hendelser } = useHendelser()


    const soknadOppgaver = skapSøknadOppgaver(soknader, env.sykepengesoknadUrl())
    const sykmeldingOppgaver = skapSykmeldingoppgaver(sykmeldinger, env.sykmeldingUrl())
    const oppfolgingsplanoppgaver = skapOppfolgingsplanOppgaver(oppfolgingsplaner, sykmeldinger, env.oppfolgingsplanUrl())
    const dialogmoteBehovOppgaver = skapDialogmoteBehovOppgaver(dialogmoteBehov, env.dialogmoteUrl())
    const dialogmoteSvarOppgaver = skapDialogmoteSvarOppgaver(dialogmoteSvar, brev, env.dialogmoteUrl())
    const brevOppgaver = skapBrevOppgaver(brev, env.dialogmoteUrl())
    const oppgaver = [
        ...sykmeldingOppgaver,
        ...soknadOppgaver,
        ...oppfolgingsplanoppgaver,
        ...dialogmoteBehovOppgaver,
        ...dialogmoteSvarOppgaver,
        ...brevOppgaver
    ]

    if (snartSluttPaSykepengene) {
        oppgaver.push({
            tekst: tekst('oppgaver.snartslutt'),
            lenke: tekst('oppgaver.snartslutt.url'),
            oppgavetype: 'advarsel'
        })
    }

    if (hendelser && getAktivitetskravvisning(hendelser) === NYTT_AKTIVITETSKRAVVARSEL) {
        oppgaver.push({
            tekst: tekst('oppgaver.aktivitetskrav'),
            lenke: '/syk/sykefravaer/aktivitetsplikt',
            oppgavetype: 'advarsel'
        })
    }

    return (
        <OppgaveLista oppgaver={oppgaver} />
    )
}

export default Oppgaver
