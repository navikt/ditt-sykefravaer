import { useEffect, useRef, useState } from 'react'
import { Alert, BodyShort, Button, Heading, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { UseOpprettFlexjarFeedback } from './queryhooks/useOpprettFlexjarFeedback'
import { UseOppdaterFlexjarFeedback } from './queryhooks/useOppdaterFlexjarFeedback'

const FEEDBACK_ID = 'arbeidssituasjon-annet'

const ARSAKER = [
    { name: 'Jeg er pensjonist', value: 'PENSJONIST' },
    { name: 'Jeg fikk ikke opp riktig arbeidsgiver', value: 'FEIL_ARBEIDSGIVER' },
    { name: 'Jeg jobber i eget AS', value: 'EGET_AS' },
    { name: 'Jeg mottar AAP', value: 'AAP' },
    { name: 'Jeg mottar uføretrygd (uten varig tilrettelagt arbeid)', value: 'UFORETRYGD' },
    { name: 'Jeg har varig tilrettelagt arbeid (VTA)', value: 'VTA' },
    { name: 'Annen årsak', value: 'ANNEN_ARSAK' },
] as const

type Arsak = (typeof ARSAKER)[number]['value']

export function AnnetArbeidssituasjonSurvey({ onTakk }: { onTakk?: () => void }) {
    const [valgtArsak, setValgtArsak] = useState<Arsak | ''>('')
    const [fritekst, setFritekst] = useState('')
    const [valideringsfeil, setValideringsfeil] = useState<string | null>(null)
    const [fritekstValideringsfeil, setFritekstValideringsfeil] = useState<string | null>(null)
    const [takk, setTakk] = useState(false)
    const takkRef = useRef<HTMLDivElement>(null)
    const fritekstRef = useRef<HTMLTextAreaElement>(null)

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
        if (!valgtArsak) return
        sendFeedback()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valgtArsak])

    const handleSend = () => {
        if (!valgtArsak) {
            setValideringsfeil('Du må velge en årsak.')
            return
        }

        if (valgtArsak === 'ANNEN_ARSAK' && !fritekst.trim()) {
            setFritekstValideringsfeil('Vennligst oppgi årsak.')
            return
        }

        sendFeedback(() => {
            setTakk(true)
            setValideringsfeil(null)
            setFritekstValideringsfeil(null)
            onTakk?.()
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
                    legend={`Hva er grunnen til at du valgte arbeidssituasjon "annet"?`}
                    value={valgtArsak}
                    onChange={(verdi) => {
                        setValgtArsak(verdi as Arsak)
                        setValideringsfeil(null)
                        if (verdi !== 'ANNEN_ARSAK') {
                            setFritekst('')
                            setFritekstValideringsfeil(null)
                        } else {
                            setTimeout(() => fritekstRef.current?.focus(), 0)
                        }
                    }}
                    error={valideringsfeil}
                >
                    {ARSAKER.map(({ name, value }) => (
                        <Radio key={value} value={value}>
                            {name}
                        </Radio>
                    ))}
                </RadioGroup>

                {valgtArsak === 'ANNEN_ARSAK' && (
                    <Textarea
                        ref={fritekstRef}
                        label="Skriv hvilken arbeidssituasjon som gjelder deg"
                        description="Ikke skriv navn, fødselsnummer eller andre personlige opplysninger"
                        value={fritekst}
                        onChange={(e) => {
                            setFritekst(e.target.value)
                            if (e.target.value.trim()) {
                                setFritekstValideringsfeil(null)
                            }
                        }}
                        error={fritekstValideringsfeil}
                        maxLength={600}
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
