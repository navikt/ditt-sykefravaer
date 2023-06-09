import { Alert, BodyShort, Button, ButtonProps, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import React, { useEffect, useRef, useState } from 'react'
import { FaceSmileIcon } from '@navikt/aksel-icons'

import { cn } from '../../utils/tw-utils'
import { isMockBackend } from '../../utils/environment'

enum Feedbacktype {
    'JA' = 'JA',
    'NEI' = 'NEI',
    'FORBEDRING' = 'FORBEDRING',
}

interface FeedbackButtonProps extends ButtonProps {
    feedbacktype: Feedbacktype
}

export const Feedback = () => {
    const [textValue, setTextValue] = useState('')
    const [activeState, setActiveState] = useState<Feedbacktype | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [thanksFeedback, setThanksFeedback] = useState<boolean>(false)
    const textAreaRef = useRef(null)

    useEffect(() => {
        textValue && errorMsg && setErrorMsg(null)
    }, [textValue, errorMsg])

    useEffect(() => {
        setActiveState(null)
        setTextValue('')
        setThanksFeedback(false)
    }, [])

    useEffect(() => {
        activeState && textAreaRef.current && (textAreaRef.current as any).focus()
        setErrorMsg(null)
    }, [activeState])

    if (!isMockBackend()) {
        return null
    }
    const fetchFeedback = async (): Promise<void> => {
        if (activeState === null) {
            return
        }

        const body = {
            feedback: textValue,
            feedbackId: 'sykepengesoknad-sporsmal',
            svar: activeState,
            app: 'sykepengesoknad-frontend',
        }

        // eslint-disable-next-line no-console
        console.log(body)
    }

    const FeedbackButton = (props: FeedbackButtonProps) => {
        return (
            <>
                <Button
                    data-cy={'feedback-' + props.feedbacktype}
                    variant="secondary-neutral"
                    size="small"
                    className={cn({
                        'bg-surface-neutral-active text-text-on-inverted hover:bg-surface-neutral-active':
                            activeState === props.feedbacktype,
                    })}
                    onClick={() => {
                        setThanksFeedback(false)
                        setActiveState((x) => (x === props.feedbacktype ? null : props.feedbacktype))
                    }}
                    {...props}
                >
                    {props.children}
                </Button>
            </>
        )
    }
    const handleSend = async () => {
        if ((activeState === Feedbacktype.FORBEDRING || activeState === Feedbacktype.NEI) && textValue === '') {
            setErrorMsg('Tilbakemeldingen kan ikke være tom. Legg til tekst i feltet.')
            return
        }
        await fetchFeedback()
        setErrorMsg(null)

        setActiveState(null)
        setTextValue('')
        setThanksFeedback(true)
    }

    const getPlaceholder = (): string => {
        switch (activeState) {
            case Feedbacktype.JA:
                return 'Er det noe du vil trekke frem? (valgfritt)'
            case Feedbacktype.NEI:
                return 'Hvilken informasjon leter du etter?'
            default:
                throw Error('Ugyldig tilbakemeldingstype')
        }
    }

    return (
        <div className="w:full mt-16 md:w-3/4" data-cy="feedback-wrapper">
            <div className="rounded-t-xl bg-gray-200 p-6">
                <Heading size="xsmall" level="2">
                    Hjelp oss med å gjøre denne siden bedre (valgfritt)
                </Heading>
            </div>
            <div className="mt-1 rounded-b-xl bg-surface-subtle p-6">
                <BodyShort className="mb-6">Fant du den informasjonen du trengte?</BodyShort>
                <div className="flex w-full gap-2">
                    <FeedbackButton feedbacktype={Feedbacktype.JA}>Ja</FeedbackButton>
                    <FeedbackButton feedbacktype={Feedbacktype.NEI}>Nei</FeedbackButton>
                </div>

                {activeState !== null && (
                    <form className="mt-6 flex w-full flex-col gap-4">
                        <Textarea
                            data-cy="feedback-textarea"
                            ref={textAreaRef}
                            error={errorMsg}
                            label={getPlaceholder()}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    await handleSend()
                                }
                            }}
                            value={textValue}
                            onChange={(e) => {
                                setThanksFeedback(false)
                                setTextValue(e.target.value)
                            }}
                            maxLength={600}
                            minRows={3}
                        />

                        {activeState == Feedbacktype.NEI && (
                            <RadioGroup className="mt-4" legend="Må du kontakte NAV for å få hjelp?">
                                <Radio value="Midterst">Ja, per telefon</Radio>
                                <Radio value="Fremst">Ja, jeg skriver til dere</Radio>
                                <Radio value="Fremst">Nei</Radio>
                            </RadioGroup>
                        )}

                        <Alert variant="warning">
                            Ikke skriv inn navn eller andre personopplysninger. Dette er en anonym tilbakemelding og
                            blir kun brukt til å forbedre tjenesten. Du vil ikke få et svar fra oss.
                        </Alert>
                        <Button
                            data-cy="send-feedback"
                            className="mr-auto"
                            size="small"
                            variant="secondary-neutral"
                            onClick={async (e) => {
                                e.preventDefault()
                                await handleSend()
                            }}
                        >
                            Send tilbakemelding
                        </Button>
                    </form>
                )}
            </div>
            <div aria-live="polite">
                {thanksFeedback && (
                    <div className="mt-2 rounded-xl bg-green-50 p-6">
                        <Heading size="small" as="p" className="flex items-center">
                            Takk for tilbakemeldingen din! <FaceSmileIcon></FaceSmileIcon>
                        </Heading>
                    </div>
                )}
            </div>
        </div>
    )
}
