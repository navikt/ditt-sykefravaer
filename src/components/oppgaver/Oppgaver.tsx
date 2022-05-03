import Alertstripe from 'nav-frontend-alertstriper'
import Lenke from 'nav-frontend-lenker'
import { Systemtittel } from 'nav-frontend-typografi'
import React, { useEffect, useState } from 'react'

import {
    getAktivitetskravvisning,
    NYTT_AKTIVITETSKRAVVARSEL,
} from '../../pages/aktivitetsplikt'
import use39ukersvarsel from '../../query-hooks/use39ukersvarsel'
import useBrev from '../../query-hooks/useBrev'
import useDialogmoteBehov from '../../query-hooks/useDialogmoteBehov'
import useDialogmoter from '../../query-hooks/useDialogmoter'
import useHendelser from '../../query-hooks/useHendelser'
import useOppfolgingsplaner from '../../query-hooks/useOppfolgingsplaner'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import {
    oppfolgingsplanUrl,
    sykepengesoknadUrl,
    sykmeldingUrl,
} from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { useDialogmotePaths } from '../NavigationHooks/useDialogmotePaths'
import { skapBrevOppgaver } from './brevOppgaver'
import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'
import { skapDialogmoteSvarOppgaver } from './dialogmoteOppgaver'
import { skapOppfolgingsplanOppgaver } from './oppfolgingsplanOppgaver'
import { Oppgave } from './oppgaveTyper'
import { skapSøknadOppgaver } from './soknadOppgaver'
import { skapSykmeldingoppgaver } from './sykmeldingOppgaver'

interface OppgaveProps {
    oppgaver: Oppgave[]
}

const OppgaveLista = ({ oppgaver }: OppgaveProps) => {
    if (oppgaver && oppgaver.length === 0) {
        return null
    }

    return (
        <section className="oppgaver">
            <Systemtittel tag="h2" className={'hide-element'}>
                Oppgaver
            </Systemtittel>
            {oppgaver.map((v, idx) => {
                return (
                    <Alertstripe type={v.oppgavetype} key={idx}>
                        <Lenke href={v.lenke}>{v.tekst}</Lenke>
                    </Alertstripe>
                )
            })}
        </section>
    )
}

function Oppgaver() {
    const [oppgaver, setOppgaver] = useState<Oppgave[]>([])

    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()
    const { data: snartSluttPaSykepengene } = use39ukersvarsel()
    const { data: oppfolgingsplaner } = useOppfolgingsplaner()
    const { data: dialogmoteBehov } = useDialogmoteBehov()
    const { data: dialogmoteSvar } = useDialogmoter()
    const { data: brev } = useBrev()
    const { data: hendelser } = useHendelser()
    const { svarMotebehovUrl, dialogmoteLandingUrl } = useDialogmotePaths()

    function hentOppgaver() {
        const soknadOppgaver = skapSøknadOppgaver(
            soknader,
            sykepengesoknadUrl()
        )
        const sykmeldingOppgaver = skapSykmeldingoppgaver(
            sykmeldinger,
            sykmeldingUrl()
        )
        const oppfolgingsplanoppgaver = skapOppfolgingsplanOppgaver(
            oppfolgingsplaner,
            sykmeldinger,
            oppfolgingsplanUrl()
        )
        const dialogmoteBehovOppgaver = skapDialogmoteBehovOppgaver(
            dialogmoteBehov,
            svarMotebehovUrl
        )
        const dialogmoteSvarOppgaver = skapDialogmoteSvarOppgaver(
            dialogmoteSvar,
            brev,
            dialogmoteLandingUrl
        )
        const brevOppgaver = skapBrevOppgaver(brev, dialogmoteLandingUrl)

        const tasks = [
            ...sykmeldingOppgaver,
            ...soknadOppgaver,
            ...oppfolgingsplanoppgaver,
            ...dialogmoteBehovOppgaver,
            ...dialogmoteSvarOppgaver,
            ...brevOppgaver,
        ]

        if (snartSluttPaSykepengene) {
            tasks.push({
                tekst: tekst('oppgaver.snartslutt'),
                lenke: tekst('oppgaver.snartslutt.url'),
                oppgavetype: 'advarsel',
            })
        }

        if (
            hendelser &&
            getAktivitetskravvisning(hendelser) === NYTT_AKTIVITETSKRAVVARSEL
        ) {
            tasks.push({
                tekst: tekst('oppgaver.aktivitetskrav'),
                lenke: '/syk/sykefravaer/aktivitetsplikt',
                oppgavetype: 'advarsel',
            })
        }

        setOppgaver(tasks)
    }

    useEffect(hentOppgaver, [
        brev,
        dialogmoteBehov,
        dialogmoteLandingUrl,
        dialogmoteSvar,
        hendelser,
        oppfolgingsplaner,
        snartSluttPaSykepengene,
        soknader,
        svarMotebehovUrl,
        sykmeldinger,
    ])

    return <OppgaveLista oppgaver={oppgaver!} />
}

export default Oppgaver
