import { Panel, Heading, BodyShort } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper, naturalytelser } from '../../types/inntektsmeldingTyper'

import { formatDateFromString } from './formatDate'
import formatCurrency from './formatCurrency'

export function Naturalytelser({ inntektsmelding = null }: { inntektsmelding?: InntektsmeldingTyper | null }) {
    return (
        <Panel className="mt-4 rounded-md border-2 border-gray-300" border>
            <Heading level="2" size="small" className="mt-2 mb-2">
                Naturalytelser
            </Heading>
            {inntektsmelding?.opphoerAvNaturalytelser?.map((naturalytelse, i) => {
                if (!naturalytelse.naturalytelse) return null
                if (!naturalytelse.fom) return null
                if (!naturalytelse.beloepPrMnd) return null
                return (
                    <div key={i} className="border-b border-gray-400 mt-8 mb-8">
                        <BodyShort spacing>
                            <strong>Ytelse:</strong> {naturalytelser[naturalytelse.naturalytelse] || 'Annet'}
                        </BodyShort>
                        <BodyShort spacing>
                            <strong>Verdi:</strong> {formatCurrency(naturalytelse.beloepPrMnd)} kr/mnd
                        </BodyShort>
                        <BodyShort className="mb-8">
                            <strong>Ytelsen bortfaller:</strong> {formatDateFromString(naturalytelse.fom)}
                        </BodyShort>
                    </div>
                )
            })}
        </Panel>
    )
}

Naturalytelser.defaultProps = {
    inntektsmelding: null,
}
