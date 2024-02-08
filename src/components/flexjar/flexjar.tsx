import React, { useState } from 'react'
import dayjs from 'dayjs'

import useVedtak from '../../hooks/useVedtak'

import { FeedbackButton, FlexjarFelles } from './flexjar-felles'

export const Flexjar = ({ feedbackId }: { feedbackId: string }) => {
    const [activeState, setActiveState] = useState<string | number | null>(null)
    const [thanksFeedback, setThanksFeedback] = useState<boolean>(false)

    const getPlaceholder = (): string => {
        switch (activeState) {
            case 'JA':
                return 'Er det noe du vil trekke frem? (valgfritt)'
            case 'NEI':
                return 'Hvilken informasjon leter du etter?'
            case 'FORBEDRING':
                return 'Hva kan forbedres?'
            default:
                throw Error('Ugyldig tilbakemeldingstype')
        }
    }

    const feedbackButtonProps = {
        activeState,
        setThanksFeedback,
        setActiveState,
    }

    const { data: vedtak } = useVedtak()

    function spinnsynMetadata(): Record<string, string | undefined | number | boolean> {
        if (vedtak && vedtak.length > 0) {
            // Klon vedtak-arrayet før sortering
            const klonedeVedtak = [...vedtak].sort((a, b) => {
                const datoA = new Date(a.opprettet)
                const datoB = new Date(b.opprettet)
                return datoB.getTime() - datoA.getTime() // Synkende rekkefølge
            })

            // Hent 'opprettet'-datoene fra det sorterte, klonede arrayet
            const sisteVedtak = klonedeVedtak[0]

            const dagerSidenSisteVedtak = dayjs().diff(dayjs(sisteVedtak.opprettet), 'day')
            const forbrukteSykepengeuker = Math.floor(sisteVedtak.vedtak.utbetaling.forbrukteSykedager / 5)
            const gjenstaendeSykepengeuker = Math.floor(sisteVedtak.vedtak.utbetaling.gjenståendeSykedager / 5)
            return {
                dagerSidenSisteVedtak,
                forbrukteSykepengeuker,
                gjenstaendeSykepengeuker,
            }
        }
        return {}
    }

    return (
        <FlexjarFelles
            feedbackId={feedbackId}
            setActiveState={setActiveState}
            activeState={activeState}
            thanksFeedback={thanksFeedback}
            setThanksFeedback={setThanksFeedback}
            getPlaceholder={getPlaceholder}
            feedbackProps={{
                ...spinnsynMetadata(),
            }}
            textRequired={activeState === 'FORBEDRING' || activeState === 'NEI'}
            flexjartittel="Hjelp oss med å gjøre denne siden bedre"
            flexjarsporsmal="Fant du den informasjonen du trengte?"
        >
            <div className="flex w-full gap-2">
                <FeedbackButton feedbackId={feedbackId} tekst="Ja" svar="JA" {...feedbackButtonProps} />
                <FeedbackButton feedbackId={feedbackId} tekst="Nei" svar="NEI" {...feedbackButtonProps} />
                <FeedbackButton
                    feedbackId={feedbackId}
                    tekst="Foreslå forbedring"
                    svar="FORBEDRING"
                    {...feedbackButtonProps}
                />
            </div>
        </FlexjarFelles>
    )
}
