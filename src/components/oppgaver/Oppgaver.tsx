import { XMarkIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Button, Heading, Link as Lenke } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import useBrev from '../../hooks/useBrev'
import useDialogmoteBehov from '../../hooks/useDialogmoteBehov'
import useMeldinger from '../../hooks/useMeldinger'
import useOppfolgingsplaner from '../../hooks/useOppfolgingsplaner'
import useSoknader from '../../hooks/useSoknader'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { dialogmoteUrl, oppfolgingsplanUrl, sykepengesoknadUrl, sykmeldingUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import { logEvent } from '../amplitude/amplitude'
import { fetchMedRequestId } from '../../utils/fetch'

import { skapBrevOppgaver } from './brevOppgaver'
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
                    } catch (e: any) {
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
        <Alert variant={oppgave.type ?? 'info'}>
            <div className="flex items-center">
                <div>
                    {oppgave.opprettet && (
                        <BodyShort as="span">{oppgave.opprettet.format('DD.MM.YYYY:') + ' '}</BodyShort>
                    )}
                    {oppgave.lenke && (
                        <Lenke
                            className="inline"
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
            </div>
        </Alert>
    )
}

interface OppgaveProps {
    oppgaver: Oppgave[]
    pushLukket: (id: string) => void
}

const OppgaveLista = ({ oppgaver, pushLukket }: OppgaveProps) => {
    if (oppgaver && oppgaver.length === 0) {
        return null
    }

    return (
        <section data-cy="oppgaver">
            <Heading size="small" level="2" className="pb-4">
                {tekst('oppgaver.nye-varsler')}
            </Heading>
            <div className="space-y-2">
                {oppgaver.map((v) => (
                    <EnkeltOppgaveAlert oppgave={v} key={v.tekst + v.id} pushLukket={pushLukket} />
                ))}
            </div>
        </section>
    )
}

function Oppgaver() {
    const { data: meldinger } = useMeldinger()
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()
    const { data: oppfolgingsplaner } = useOppfolgingsplaner()
    const { data: dialogmoteBehov } = useDialogmoteBehov()
    const { data: brev } = useBrev()
    const [lukkede, setLukkede] = useState([] as string[])

    const pushLukket = (id: string) => {
        setLukkede((current) => [...current, id])
    }

    const soknadOppgaver = skapSøknadOppgaver(soknader, sykepengesoknadUrl())
    const sykmeldingOppgaver = skapSykmeldingoppgaver(sykmeldinger, sykmeldingUrl())
    const oppfolgingsplanoppgaver = skapOppfolgingsplanOppgaver(oppfolgingsplaner, sykmeldinger, oppfolgingsplanUrl())
    const dialogmoteBehovOppgaver = skapDialogmoteBehovOppgaver(dialogmoteBehov, `${dialogmoteUrl()}/motebehov/svar`)

    const brevOppgaver = skapBrevOppgaver(brev, dialogmoteUrl())
    const meldingerOppgaver = skapMeldinger(meldinger)

    const tasks = [
        ...sykmeldingOppgaver,
        ...soknadOppgaver,
        ...oppfolgingsplanoppgaver,
        ...dialogmoteBehovOppgaver,
        ...brevOppgaver,
        ...meldingerOppgaver,
    ].filter((o) => !o.id || !lukkede.includes(o.id))

    return <OppgaveLista oppgaver={tasks} pushLukket={pushLukket} />
}

export default Oppgaver
