import { Close } from '@navikt/ds-icons'
import { Alert, BodyShort, Button, Heading, Link as Lenke } from '@navikt/ds-react'
import { logger } from '@navikt/next-logger'
import React, { useEffect, useState } from 'react'

import useBrev from '../../query-hooks/useBrev'
import useDialogmoteBehov from '../../query-hooks/useDialogmoteBehov'
import useMeldinger from '../../query-hooks/useMeldinger'
import useOppfolgingsplaner from '../../query-hooks/useOppfolgingsplaner'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { dialogmoteUrl, oppfolgingsplanUrl, sykepengesoknadUrl, sykmeldingUrl } from '../../utils/environment'
import Fetch from '../../utils/fetch'
import { tekst } from '../../utils/tekster'
import { logEvent } from '../amplitude/amplitude'
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

    useEffect(() => {
        logEvent('alert vist', {
            tekst: oppgave.meldingType ?? oppgave.tekst,
            variant: oppgave.type ?? 'info',
            komponent: 'ditt sykefravær oppgave',
        })
    }, [oppgave.meldingType, oppgave.tekst, oppgave.type])

    if (!vises) {
        return null
    }

    const lukkeknapp = () => (
        <Button
            variant={'secondary'}
            style={{ marginLeft: '1em', height: '32px', padding: 0 }}
            size={'small'}
            onClick={() => {
                setVises(false)
                logEvent('knapp klikket', {
                    tekst: 'close ikon',
                    alerttekst: oppgave.meldingType ?? oppgave.tekst,
                    variant: oppgave.type ?? 'info',
                    komponent: 'ditt sykefravær oppgave',
                })
                if (oppgave.id) {
                    Fetch.authenticatedPost(
                        `/syk/sykefravaer/ditt-sykefravaer-backend/api/v1/meldinger/${oppgave.id}/lukk`
                    ).catch((e) => logger.warn(e, 'Feil ved merking av melding som lest'))
                }
            }}
        >
            <Close title={'Lukk'} />
        </Button>
    )

    return (
        <Alert variant={oppgave.type ?? 'info'}>
            <div className="oppgave-tekst">
                {oppgave.opprettet && <BodyShort as="span">{oppgave.opprettet.format('DD.MM.YYYY:') + ' '}</BodyShort>}
                {oppgave.lenke && (
                    <Lenke
                        href={oppgave.lenke}
                        onClick={(e) => {
                            e.preventDefault()
                            logEvent('navigere', {
                                destinasjon: oppgave.lenke!,
                                lenketekst: oppgave.meldingType ?? oppgave.tekst,
                                variant: oppgave.type ?? 'info',
                                komponent: 'ditt sykefravær oppgave',
                            })
                            window.location.href = oppgave.lenke!
                        }}
                    >
                        {oppgave.tekst}
                    </Lenke>
                )}
                {!oppgave.lenke && oppgave.tekst}
            </div>
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
            <Heading size="small" level="1">
                {tekst('oppgaver.nye-varsler')}
            </Heading>
            {oppgaver.map((v, idx) => (
                <EnkeltOppgaveAlert oppgave={v} key={v.tekst} />
            ))}
        </section>
    )
}

function Oppgaver() {
    const [oppgaver, setOppgaver] = useState<Oppgave[]>([])

    const { data: meldinger } = useMeldinger()
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()
    const { data: oppfolgingsplaner } = useOppfolgingsplaner()
    const { data: dialogmoteBehov } = useDialogmoteBehov()
    const { data: brev } = useBrev()

    function hentOppgaver() {
        const soknadOppgaver = skapSøknadOppgaver(soknader, sykepengesoknadUrl())
        const sykmeldingOppgaver = skapSykmeldingoppgaver(sykmeldinger, sykmeldingUrl())
        const oppfolgingsplanoppgaver = skapOppfolgingsplanOppgaver(
            oppfolgingsplaner,
            sykmeldinger,
            oppfolgingsplanUrl()
        )
        const dialogmoteBehovOppgaver = skapDialogmoteBehovOppgaver(
            dialogmoteBehov,
            `${dialogmoteUrl()}/motebehov/svar`
        )

        const brevOppgaver = skapBrevOppgaver(brev, dialogmoteUrl())
        const meldingerOppgaver = skapMeldinger(meldinger)

        const tasks = [
            ...sykmeldingOppgaver,
            ...soknadOppgaver,
            ...oppfolgingsplanoppgaver,
            ...dialogmoteBehovOppgaver,
            ...brevOppgaver,
            ...meldingerOppgaver,
        ]

        setOppgaver(tasks)
    }

    useEffect(hentOppgaver, [brev, dialogmoteBehov, oppfolgingsplaner, soknader, sykmeldinger, meldinger])

    return <OppgaveLista oppgaver={oppgaver!} />
}

export default Oppgaver
