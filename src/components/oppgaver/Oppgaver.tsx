import { Alert, Heading } from '@navikt/ds-react'
import { Link as Lenke } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import use39ukersvarsel from '../../query-hooks/use39ukersvarsel'
import useBrev from '../../query-hooks/useBrev'
import useDialogmoteBehov from '../../query-hooks/useDialogmoteBehov'
import useDialogmoter from '../../query-hooks/useDialogmoter'
import useOppfolgingsplaner from '../../query-hooks/useOppfolgingsplaner'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import {
    oppfolgingsplanUrl,
    snartSluttUrl,
    sykepengesoknadUrl,
    sykmeldingUrl,
} from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { useDialogmotePaths } from '../NavigationHooks/useDialogmotePaths'
import { skapBrevOppgaver } from './brevOppgaver'
import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'
import { skapDialogmoteSvarOppgaver } from './dialogmoteOppgaver'
import { skapInntektsmeldingOppgave } from './inntektsmeldingBeskjed'
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
            <Heading size="medium" level="2" className="hide-element">
                Oppgaver
            </Heading>
            {oppgaver.map((v, idx) => {
                return (
                    <Alert variant={v.type} key={idx}>
                        <Lenke href={v.lenke}>{v.tekst}</Lenke>
                    </Alert>
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
        const inntektsmeldingOppgaver = skapInntektsmeldingOppgave(
            '/syk/sykefravaer/inntektsmelding'
        )

        const tasks = [
            ...sykmeldingOppgaver,
            ...soknadOppgaver,
            ...oppfolgingsplanoppgaver,
            ...dialogmoteBehovOppgaver,
            ...dialogmoteSvarOppgaver,
            ...brevOppgaver,
            ...inntektsmeldingOppgaver,
        ]

        if (snartSluttPaSykepengene) {
            tasks.push({
                type: 'info',
                tekst: tekst('oppgaver.snartslutt'),
                lenke: snartSluttUrl(),
            })
        }

        setOppgaver(tasks)
    }

    useEffect(hentOppgaver, [
        brev,
        dialogmoteBehov,
        dialogmoteLandingUrl,
        dialogmoteSvar,
        oppfolgingsplaner,
        snartSluttPaSykepengene,
        soknader,
        svarMotebehovUrl,
        sykmeldinger,
    ])

    return <OppgaveLista oppgaver={oppgaver!} />
}

export default Oppgaver
