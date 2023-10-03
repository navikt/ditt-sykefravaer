import { BodyShort, Heading, Panel, ReadMore } from '@navikt/ds-react'
import React from 'react'
import dayjs from 'dayjs'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'
import { cn } from '../../utils/tw-utils'

import { formatDateFromString } from './formatDate'

export function ArbeidsgiverperiodePanel({ inntektsmelding }: { inntektsmelding: InntektsmeldingTyper }) {
    return (
        <Panel className="mt-4 rounded-md border-2 border-gray-300" border>
            <Heading level="2" size="small" className="mt-2">
                Arbeidsgiverperiode
            </Heading>
            <ReadMore className="mt-4" header="Les mer">
                Arbeidsgiveren din er vanligvis ansvarlig for å betale sykepenger til deg de første 16 kalenderdagene av
                sykefraværet ditt. Etter dette overtar NAV betalingen til deg eller din arbeidsgiver hvis du har rett
                til sykepenger.
            </ReadMore>

            {inntektsmelding.arbeidsgiverperioder.map((agperiode, i) => {
                const isLast = i === inntektsmelding.arbeidsgiverperioder.length - 1
                const fom = dayjs(agperiode.fom)
                const tom = dayjs(agperiode.tom)
                const antallDager = tom.diff(fom, 'day') + 1
                return (
                    <div
                        key={i}
                        className={cn('mt-4 mb-4', {
                            'border-b border-gray-400': !isLast,
                        })}
                    >
                        <BodyShort>
                            <span className="font-bold">Periode:</span>
                            {` ${formatDateFromString(agperiode.fom)} - ${formatDateFromString(agperiode.tom)}`}
                        </BodyShort>
                        <BodyShort spacing>
                            <span className="font-bold">Antall dager: </span>
                            {antallDager}
                        </BodyShort>
                    </div>
                )
            })}
        </Panel>
    )
}
