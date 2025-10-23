import { ReactElement, useEffect, useRef, useState } from 'react'
import { Alert, BodyShort, Box, Button, Heading } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { XMarkIcon } from '@navikt/aksel-icons'
import { UseMutationResult } from '@tanstack/react-query'

import { FormValues } from '../SendSykmeldingForm'
import { QuestionWrapper } from '../../FormComponents/FormStructure'
import { isArbeidstaker } from '../../../utils/arbeidssituasjonUtils'
import { logAmplitudeEvent } from '../../amplitude/amplitude'
import { SykmeldingChangeStatus, useChangeSykmeldingStatus } from '../../../hooks/useChangeSykmeldingStatus'
import { SendSykmeldingMutation } from '../../../hooks/useSendSykmelding'

import { getTrengerNySykmelding } from './shared/sykmeldingUtils'

interface Props {
    sykmeldingId: string
    sendResult: UseMutationResult<SendSykmeldingMutation, unknown, FormValues, unknown>
    onSykmeldingAvbrutt: () => void
}

function ActionSection({ sykmeldingId, sendResult, onSykmeldingAvbrutt }: Props): ReactElement {
    const avbryteRef = useRef<HTMLButtonElement>(null)
    const [avbrytSykmelding, setAvbrytSykmelding] = useState(false)
    const { watch } = useFormContext<FormValues>()
    const [arbeidssituasjon, fisker] = watch(['arbeidssituasjon', 'fisker'])
    const trengerNySykmelding = getTrengerNySykmelding(watch('uriktigeOpplysninger'))

    if (trengerNySykmelding) {
        return <AvbrytTrengerNySykmelding sykmeldingId={sykmeldingId} />
    }

    return (
        <QuestionWrapper>
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col gap-8">
                    <Button id="send-sykmelding-button" variant="primary" type="submit" loading={sendResult.isPending}>
                        {isArbeidstaker(arbeidssituasjon, fisker) ? 'Send' : 'Bekreft'} sykmelding
                    </Button>
                    <Button
                        ref={avbryteRef}
                        variant="secondary"
                        type="button"
                        onClick={() => setAvbrytSykmelding((b) => !b)}
                    >
                        Avbryt sykmeldingen
                    </Button>
                </div>
            </div>
            {avbrytSykmelding && (
                <AvbrytSykmeldingen
                    sykmeldingId={sykmeldingId}
                    onAvbryt={onSykmeldingAvbrutt}
                    closeAvbryt={() => {
                        setAvbrytSykmelding(false)
                        requestAnimationFrame(() => avbryteRef.current?.focus())
                    }}
                />
            )}
            {sendResult.isError && (
                <Alert className="mt-8" variant="error" role="alert">
                    <Heading size="small" level="3" spacing>
                        Klarte ikke å sende inn sykmeldingen
                    </Heading>
                    <BodyShort spacing>
                        Innsendingen ble ikke gjennomført på grunn av en ukjent feil, vi jobber allerede med å løse
                        problemet. Vennligst prøv igjen senere.
                    </BodyShort>
                    <BodyShort>Vennligst kontakt NAV dersom problemet vedvarer.</BodyShort>
                </Alert>
            )}
        </QuestionWrapper>
    )
}

function AvbrytTrengerNySykmelding({ sykmeldingId }: { sykmeldingId: string }): ReactElement {
    const boxRef = useRef<HTMLDivElement>(null)
    const avbrytMutation = useAvbryt(sykmeldingId, () => void 0)

    return (
        <Box ref={boxRef} className="mt-8 flex flex-col items-center justify-center" background="bg-subtle" padding="4">
            <Heading size="small" level="3" spacing>
                Du kan ikke bruke denne sykmeldingen
            </Heading>
            <BodyShort className="mx-3/4">
                Du må avbryte denne sykmeldingen og kontakte den som har sykmeldt deg for å få en ny.
            </BodyShort>
            <Button
                className="mt-4"
                variant="danger"
                type="button"
                loading={avbrytMutation.isPending}
                onClick={() => avbrytMutation.mutate()}
            >
                Avbryt sykmeldingen
            </Button>
            {avbrytMutation.isError && (
                <Alert className="mt-4" variant="error" role="alert">
                    Det oppsto en feil ved avbryting av sykmeldingen. Vennligst prøv igjen senere.
                </Alert>
            )}
        </Box>
    )
}

function AvbrytSykmeldingen({
    sykmeldingId,
    onAvbryt,
    closeAvbryt,
}: {
    sykmeldingId: string
    closeAvbryt: () => void
    onAvbryt: () => void
}): ReactElement {
    const boxRef = useRef<HTMLDivElement>(null)
    const avbrytMutation = useAvbryt(sykmeldingId, onAvbryt)

    useEffect(() => {
        boxRef.current?.focus()
    }, [boxRef])

    return (
        <Box
            ref={boxRef}
            className="relative mt-8 flex flex-col items-center justify-center"
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    closeAvbryt()
                }
            }}
            tabIndex={-1}
            role="dialog"
            aria-labelledby={`${sykmeldingId}-avbryt-body`}
            background="bg-subtle"
            padding="4"
        >
            <BodyShort id={`${sykmeldingId}-avbryt-body`} className="max-w-3/4">
                Er du sikker på at du vil avbryte sykmeldingen?
            </BodyShort>
            <Button
                className="mt-4"
                variant="danger"
                type="button"
                loading={avbrytMutation.isPending}
                onClick={() => avbrytMutation.mutate()}
            >
                Ja, jeg er sikker
            </Button>
            <Button
                className="absolute right-1 top-1"
                variant="tertiary"
                type="button"
                icon={<XMarkIcon title="Lukk avbryt box" />}
                onClick={closeAvbryt}
            />
            {avbrytMutation.isError && (
                <Alert className="mt-4" variant="error" role="alert">
                    Det oppsto en feil ved avbryting av sykmeldingen. Vennligst prøv igjen senere.
                </Alert>
            )}
        </Box>
    )
}

function useAvbryt(sykmeldingId: string, onAvbryt: () => void) {
    return useChangeSykmeldingStatus(
        sykmeldingId,
        SykmeldingChangeStatus.AVBRYT,
        () => {
            onAvbryt()
            logAmplitudeEvent({ eventName: 'skjema fullført', data: { skjemanavn: 'avbryt åpen sykmelding' } })
        },
        () =>
            logAmplitudeEvent({
                eventName: 'skjema innsending feilet',
                data: { skjemanavn: 'avbryt åpen sykmelding' },
            }),
    )
}

export default ActionSection
