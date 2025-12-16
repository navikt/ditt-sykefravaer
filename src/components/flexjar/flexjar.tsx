import React, { useState } from 'react'
import dayjs from 'dayjs'

import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'
import useMaxDate from '../../hooks/useMaxDate'
import { erSykmeldingInnafor } from '../maksdato/skalViseMaksDato'

import { FeedbackButton, FlexjarFelles } from './flexjar-felles'

export const Flexjar = ({
    feedbackId,
    sporsmal,
    feedbackProps,
}: {
    feedbackId: string
    sporsmal?: string
    feedbackProps?: Record<string, string | undefined | boolean | number>
}) => {
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

    const { data: sykmeldinger } = useTsmSykmeldinger()
    const { data: maxdate } = useMaxDate(
        sykmeldinger?.some((sykmelding) => erSykmeldingInnafor(sykmelding, 17)) ?? false,
    )

    function maksdatoMetadata(): Record<string, string | undefined | number | boolean> {
        const ret = {} as Record<string, string | undefined | number | boolean>
        if (sykmeldinger) {
            const datoer = [] as string[]
            sykmeldinger.forEach((s) => {
                s.sykmeldingsperioder.forEach((p) => {
                    datoer.push(p.tom)
                })
            })
            datoer.sort((a, b) => dayjs(b).diff(dayjs(a)))
            if (datoer.length > 0) {
                ret['dagerSidenSisteSykmelding'] = dayjs().diff(dayjs(datoer[0]), 'day')
            }
        }
        if (maxdate) {
            if (maxdate.maxDate) {
                ret['dagerTilMaksdato'] = dayjs(maxdate.maxDate).diff(dayjs(), 'days')
            }
            if (maxdate.utbetaltTom) {
                ret['dagerSidenSisteUtbetaling'] = dayjs().diff(dayjs(maxdate.utbetaltTom), 'days')
            }
        }

        return ret
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
                ...maksdatoMetadata(),
                ...feedbackProps,
            }}
            textRequired={activeState === 'FORBEDRING' || activeState === 'NEI'}
            flexjartittel="Hjelp oss med å gjøre denne siden bedre"
            flexjarsporsmal={sporsmal || 'Fant du den informasjonen du trengte?'}
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
