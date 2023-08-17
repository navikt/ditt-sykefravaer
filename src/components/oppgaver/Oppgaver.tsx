import { XMarkIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Button, Link as Lenke, Skeleton } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import useDialogmoteBehov from '../../hooks/useDialogmoteBehov'
import useMeldinger from '../../hooks/useMeldinger'
import useOppfolgingsplaner from '../../hooks/useOppfolgingsplaner'
import useSoknader from '../../hooks/useSoknader'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { dialogmoteUrl, oppfolgingsplanUrl, sykepengesoknadUrl, sykmeldingUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { logEvent } from '../amplitude/amplitude'
import { fetchMedRequestId } from '../../utils/fetch'

import { skapDialogmoteBehovOppgaver } from './dialogmoteBehovOppgaver'
import { skapMeldinger } from './meldinger'
import { skapOppfolgingsplanOppgaver } from './oppfolgingsplanOppgaver'
import { Oppgave } from './oppgaveTyper'
import { skapSøknadOppgaver } from './soknadOppgaver'
import { skapSykmeldingoppgaver } from './sykmeldingOppgaver'

interface EnkeltOppgaveAlertProps {
    oppgave: Oppgave
    pushLukket: (id: string) => void
}

const EnkeltOppgaveAlert = ({ oppgave, pushLukket }: EnkeltOppgaveAlertProps) => {
    useEffect(() => {
        logEvent('alert vist', {
            tekst: oppgave.meldingType ?? oppgave.tekst,
            variant: oppgave.type ?? 'info',
            komponent: 'ditt sykefravær oppgave',
        })
    }, [oppgave.meldingType, oppgave.tekst, oppgave.type])

    const lukkeknapp = () => (
        <Button
            aria-label="Lukk"
            variant="secondary"
            size="small"
            className="bg-white"
            onClick={async () => {
                logEvent('knapp klikket', {
                    tekst: 'close ikon',
                    alerttekst: oppgave.meldingType ?? oppgave.tekst,
                    variant: oppgave.type ?? 'info',
                    komponent: 'ditt sykefravær oppgave',
                })
                if (oppgave.id) {
                    try {
                        await fetchMedRequestId(
                            `/syk/sykefravaer/api/ditt-sykefravaer-backend/api/v1/meldinger/${oppgave.id}/lukk`,
                            {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            },
                        )
                    } catch (e) {
                        // Viser ikke feilmelding til bruker siden lukking kan funke neste gang hen prøver.
                        // Feilen blir logget i fetchMedRequestId.
                    } finally {
                        pushLukket(oppgave.id as string)
                    }
                }
            }}
            icon={<XMarkIcon title="Lukk" />}
        />
    )

    return (
        <Alert variant={oppgave.type ?? 'info'} className="[&>div]:w-full">
            <div className="flex items-center justify-between">
                <div>
                    {oppgave.opprettet && (
                        <BodyShort as="span">{oppgave.opprettet.format('DD.MM.YYYY:') + ' '}</BodyShort>
                    )}
                    {oppgave.lenke && (
                        <Lenke
                            className="inline"
                            href={oppgave.lenke}
                            onClick={(e) => {
                                if (!oppgave.lenke) return
                                e.preventDefault()
                                logEvent('navigere', {
                                    destinasjon: oppgave.lenke,
                                    lenketekst: oppgave.meldingType ?? oppgave.tekst,
                                    variant: oppgave.type ?? 'info',
                                    komponent: 'ditt sykefravær oppgave',
                                })

                                window.location.href = oppgave.lenke
                            }}
                        >
                            {oppgave.tekst}
                        </Lenke>
                    )}
                    {!oppgave.lenke && oppgave.tekst}
                </div>
                {oppgave.lukkbar && lukkeknapp()}
            </div>
        </Alert>
    )
}

interface OppgaveProps {
    oppgaver: Oppgave[]
    pushLukket: (id: string) => void
    lasterData: boolean
}

const OppgaveLista = ({ oppgaver, pushLukket, lasterData }: OppgaveProps) => {
    if (lasterData && oppgaver.length === 0) {
        return <Skeleton variant="rectangle" height="70px" className="rounded" />
    }
    if (oppgaver.length === 0) {
        return null
    }

    return (
        <section data-cy="oppgaver" aria-label={tekst('oppgaver.nye-varsler')}>
            <div className="space-y-2">
                {oppgaver.map((v) => (
                    <EnkeltOppgaveAlert oppgave={v} key={v.tekst + v.id} pushLukket={pushLukket} />
                ))}
            </div>
        </section>
    )
}

function Oppgaver() {
    const { data: meldinger, isLoading: meldingerLaster } = useMeldinger()
    const { data: sykmeldinger, isLoading: sykmeldingerLaster } = useSykmeldinger()
    const { data: soknader, isLoading: soknaderLaster } = useSoknader()
    const { data: oppfolgingsplaner, isLoading: oppfolgingsplanerLaster } = useOppfolgingsplaner()
    const { data: dialogmoteBehov, isLoading: dialogmoteBehovLaster } = useDialogmoteBehov()

    const [lukkede, setLukkede] = useState([] as string[])

    const pushLukket = (id: string) => {
        setLukkede((current) => [...current, id])
    }

    const soknadOppgaver = skapSøknadOppgaver(soknader, sykepengesoknadUrl())
    const sykmeldingOppgaver = skapSykmeldingoppgaver(sykmeldinger, sykmeldingUrl())
    const oppfolgingsplanoppgaver = skapOppfolgingsplanOppgaver(oppfolgingsplaner, sykmeldinger, oppfolgingsplanUrl())
    const dialogmoteBehovOppgaver = skapDialogmoteBehovOppgaver(dialogmoteBehov, `${dialogmoteUrl()}/motebehov/svar`)

    const meldingerOppgaver = skapMeldinger(meldinger)

    const tasks = [
        ...sykmeldingOppgaver,
        ...soknadOppgaver,
        ...oppfolgingsplanoppgaver,
        ...dialogmoteBehovOppgaver,
        ...meldingerOppgaver,
    ].filter((o) => !o.id || !lukkede.includes(o.id))
    const lasterData =
        meldingerLaster ||
        sykmeldingerLaster ||
        soknaderLaster ||
        oppfolgingsplanerLaster ||
        dialogmoteBehovLaster

    return <OppgaveLista oppgaver={tasks} pushLukket={pushLukket} lasterData={lasterData} />
}

export default Oppgaver
