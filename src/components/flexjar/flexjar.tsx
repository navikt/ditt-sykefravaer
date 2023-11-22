import React, { useState } from 'react'

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

    return (
        <FlexjarFelles
            feedbackId={feedbackId}
            setActiveState={setActiveState}
            activeState={activeState}
            thanksFeedback={thanksFeedback}
            setThanksFeedback={setThanksFeedback}
            getPlaceholder={getPlaceholder}
            app="ditt-sykefravaer-frontend"
            feedbackProps={{}}
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
