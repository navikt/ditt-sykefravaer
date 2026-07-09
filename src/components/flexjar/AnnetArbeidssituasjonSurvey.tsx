import { useEffect, useRef, useState } from 'react'
import { Alert, BodyShort, Button, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { UseOpprettFlexjarFeedback } from './queryhooks/useOpprettFlexjarFeedback'
import { UseOppdaterFlexjarFeedback } from './queryhooks/useOppdaterFlexjarFeedback'

const FEEDBACK_ID = 'arbeidssituasjon-annet'

const ARSAKER = [
    'Jeg er pensjonist',
    'Jeg fikk ikke opp riktig arbeidsgiver',
    'Jeg jobber i eget AS',
    'Jeg mottar AAP',
    'Jeg mottar uføretrygd (uten varig tilrettelagt arbeid)',
    'Jeg har varig tilrettelagt arbeid (VTA)',
    'Annen årsak',
] as const

export function AnnetArbeidssituasjonSurvey() {
    const [valgtArsak, setValgtArsak] = useState('')
    const [fritekst, setFritekst] = useState('')
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null)
    const [takk, setTakk] = useState(false)
    const takkRef = useRef<HTMLDivElement>(null)

    const { mutate: opprettFeedback, data } = UseOpprettFlexjarFeedback()
    const { mutate: oppdaterFeedback } = UseOppdaterFlexjarFeedback()

    const sendFeedback = (cb?: () => void) => {
        const body = {
            feedback: fritekst,
            feedbackId: FEEDBACK_ID,
            svar: valgtArsak,
        }

        if (data?.id) {
            oppdaterFeedback({ body, id: data.id, cb })
        } else {
            opprettFeedback(body)
        }
    }

    useEffect(() => {
        sendFeedback()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSend = () => {
        if (!valgtArsak) {
            setValideringsfeil('Du må velge en årsak.')
            return
        }

        sendFeedback(() => {
            setTakk(true)
            setValideringsfeil(null)
        })
    }

    // Flytt fokus til suksess-melding slik at skjermlesere varsles
    useEffect(() => {
        if (takk) {
            takkRef.current?.focus()
        }
    }, [takk])

    if (takk) {
        return (
            <div
                ref={takkRef}
                tabIndex={-1}
                className="mt-4 border-4 border-green-100 rounded-medium bg-green-100 p-6 flex flex-row items-center"
            >
                <div>
                    <Heading size="small" level="3" className="mb-2">
                        Takk for tilbakemeldingen!
                    </Heading>
                    <BodyShort>Vi setter stor pris på at du tok deg tid til å dele dine tanker med oss.</BodyShort>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-4 border-4 border-surface-subtle rounded-medium">
            <div className="bg-surface-subtle px-4 pt-4 pb-2">
                <Heading size="medium" level="2" className="mb-1">
                    Hjelp oss å forbedre valgene for arbeidssituasjon
                </Heading>
                <BodyShort>Svarene dine er anonyme</BodyShort>
            </div>

            <div className="p-4 flex flex-col gap-4">
                <div className="bg-surface-info-subtle p-3 rounded-medium">
                    <BodyShort>
                        Dette er ikke en del av sykmeldingen din. Svarene går ikke til saksbehandleren din.
                    </BodyShort>
                </div>

                <RadioGroup
                    legend="Hva er grunnen til at ingen av alternativene passet?"
                    value={valgtArsak}
                    onChange={(verdi) => {
                        setValgtArsak(verdi)
                        setValideringsfeil(null)
                        if (verdi !== 'Annen årsak') {
                            setFritekst('')
                        }
                    }}
                    error={valideringsfeil}
                >
                    {ARSAKER.map((arsak) => (
                        <Radio key={arsak} value={arsak}>
                            {arsak}
                        </Radio>
                    ))}
                </RadioGroup>

                {valgtArsak === 'Annen årsak' && (
                    <Textarea
                        label="Skriv hvilken arbeidssituasjon som gjelder deg"
                        description="Ikke skriv navn, fødselsnummer eller andre personlige opplysninger"
                        value={fritekst}
                        onChange={(e) => setFritekst(e.target.value)}
                        maxLength={100}
                        minRows={2}
                    />
                )}

                <Alert variant="warning">
                    Tilbakemeldingen din er anonym og vil ikke knyttes til sykmeldingen din. Den brukes kun for å gjøre
                    nettsidene bedre.
                </Alert>

                <Button
                    variant="secondary-neutral"
                    size="medium"
                    className="w-fit"
                    onClick={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                >
                    Send tilbakemelding
                </Button>
            </div>
        </div>
    )
}
