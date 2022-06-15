import { Close } from '@navikt/ds-icons'
import { Alert, Button, Heading, Link as Lenke } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import use39ukersvarsel from '../../query-hooks/use39ukersvarsel'
import useBrev from '../../query-hooks/useBrev'
import useDialogmoteBehov from '../../query-hooks/useDialogmoteBehov'
import useMeldinger from '../../query-hooks/useMeldinger'
import useOppfolgingsplaner from '../../query-hooks/useOppfolgingsplaner'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import {
    newDialogmoteUrl,
    oppfolgingsplanUrl,
    snartSluttUrl,
    sykepengesoknadUrl,
    sykmeldingUrl,
} from '../../utils/environment'
import Fetch from '../../utils/fetch'
import { logger } from '../../utils/logger'
import { tekst } from '../../utils/tekster'
import { skapBrevOppgaver } from './brevOppgaver'
import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'
import { skapMeldinger } from './meldinger'
import { skapOppfolgingsplanOppgaver } from './oppfolgingsplanOppgaver'
import { Oppgave } from './oppgaveTyper'
import { skapSøknadOppgaver } from './soknadOppgaver'
import { skapSykmeldingoppgaver } from './sykmeldingOppgaver'

interface EnkeltOppgaveAlertProps {
    oppgave: Oppgave
}

const EnkeltOppgaveAlert = ({ oppgave }: EnkeltOppgaveAlertProps) => {
    const [vises, setVises] = useState<boolean>(true)
    if (!vises) {
        return null
    }

    const lukkeknapp = () => (
        <Button
            variant={'secondary'}
            style={{ marginLeft: '1em' }}
            size={'small'}
            onClick={() => {
                setVises(false)
                if (oppgave.id) {
                    Fetch.authenticatedPost(
                        `/syk/sykefravaer/api/v1/meldinger/${oppgave.id}/lukk`
                    ).catch((e) =>
                        logger.warn('Feil ved merking av melding som lest', e)
                    )
                }
            }}
        >
            <Close title={'Lukk'} />
        </Button>
    )

    return (
        <Alert variant={!oppgave.type ? 'info' : oppgave.type}>
            {oppgave.opprettet && (
                <span style={{ color: '#A0A0A0' }}>
                    {oppgave.opprettet.format('DD.MM.YYYY:') + ' '}
                </span>
            )}
            {oppgave.lenke && (
                <Lenke style={{ display: 'inline' }} href={oppgave.lenke}>
                    {oppgave.tekst}
                </Lenke>
            )}
            {!oppgave.lenke && oppgave.tekst}
            {oppgave.lukkbar && lukkeknapp()}
        </Alert>
    )
}

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
            {oppgaver.map((v, idx) => (
                <EnkeltOppgaveAlert oppgave={v} key={idx}></EnkeltOppgaveAlert>
            ))}
        </section>
    )
}

function Oppgaver() {
    const [oppgaver, setOppgaver] = useState<Oppgave[]>([])

    const { data: meldinger } = useMeldinger()
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()
    const { data: snartSluttPaSykepengene } = use39ukersvarsel()
    const { data: oppfolgingsplaner } = useOppfolgingsplaner()
    const { data: dialogmoteBehov } = useDialogmoteBehov()
    const { data: brev } = useBrev()

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
            `${newDialogmoteUrl()}/motebehov/svar`
        )

        const brevOppgaver = skapBrevOppgaver(brev, newDialogmoteUrl())
        const meldingerOppgaver = skapMeldinger(meldinger)

        const tasks = [
            ...sykmeldingOppgaver,
            ...soknadOppgaver,
            ...oppfolgingsplanoppgaver,
            ...dialogmoteBehovOppgaver,
            ...brevOppgaver,
            ...meldingerOppgaver,
        ]

        if (snartSluttPaSykepengene) {
            tasks.push({
                tekst: tekst('oppgaver.snartslutt'),
                lenke: snartSluttUrl(),
            })
        }

        setOppgaver(tasks)
    }

    useEffect(hentOppgaver, [
        brev,
        dialogmoteBehov,
        oppfolgingsplaner,
        snartSluttPaSykepengene,
        soknader,
        sykmeldinger,
        meldinger,
    ])

    return <OppgaveLista oppgaver={oppgaver!} />
}

export default Oppgaver
