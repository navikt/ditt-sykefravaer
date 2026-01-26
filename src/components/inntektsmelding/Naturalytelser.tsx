import { BodyShort, Box, Heading } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper, naturalytelser } from '../../types/inntektsmeldingTyper'
import { cn } from '../../utils/tw-utils'
import { toReadableDate } from '../../utils/dateUtils'

import formatCurrency from './formatCurrency'

export function Naturalytelser({ inntektsmelding = null }: { inntektsmelding?: InntektsmeldingTyper | null }) {
    return (
        <Box className="mt-8" padding="4" borderWidth="1" borderRadius="8" borderColor="border-default">
            <Heading level="2" size="small" className="mt-2 mb-2">
                Naturalytelser
            </Heading>
            {inntektsmelding?.opphoerAvNaturalytelser?.map((naturalytelse, i) => {
                if (!naturalytelse.naturalytelse) return null
                if (!naturalytelse.fom) return null
                if (!naturalytelse.beloepPrMnd) return null
                const isLastNaturalytelse = i === inntektsmelding.opphoerAvNaturalytelser.length - 1

                return (
                    <div
                        key={i}
                        className={cn('mt-8 mb-8', {
                            'border-b border-gray-400': !isLastNaturalytelse,
                        })}
                    >
                        <BodyShort spacing>
                            <span className="font-bold">Ytelse:</span>{' '}
                            {naturalytelser[naturalytelse.naturalytelse] || 'Annet'}
                        </BodyShort>
                        <BodyShort spacing>
                            <span className="font-bold">Verdi:</span> {formatCurrency(naturalytelse.beloepPrMnd)} kr/mnd
                        </BodyShort>
                        <BodyShort className="mb-8">
                            <span className="font-bold">Ytelsen bortfaller:</span> {toReadableDate(naturalytelse.fom)}
                        </BodyShort>
                    </div>
                )
            })}
        </Box>
    )
}
