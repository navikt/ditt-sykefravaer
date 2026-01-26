import { BodyShort, ExpansionCard } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'
import { toReadableDate } from '../../utils/dateUtils'

import formatCurrency from './formatCurrency'

export function InntektsmeldingPanel({ inntektsmelding = null }: { inntektsmelding?: InntektsmeldingTyper | null }) {
    const { foersteFravaersdag, beregnetInntekt } = inntektsmelding || {}

    return (
        <>
            <ExpansionCard size="small" aria-label="Informasjon om beregnet månedsinntekt" className="mb-8 mt-8">
                <ExpansionCard.Header>
                    <ExpansionCard.Title size="small" as="h2">
                        Beregnet månedsinntekt: {formatCurrency(beregnetInntekt)} kr
                    </ExpansionCard.Title>
                </ExpansionCard.Header>

                <ExpansionCard.Content>
                    <BodyShort>
                        Beregnet månedsinntekt er den inntekten som sykepenger regnes ut fra. Dette skal som regel være
                        gjennomsnittet av inntekten din de siste tre kalendermånedene før sykefraværet startet.
                    </BodyShort>
                </ExpansionCard.Content>
            </ExpansionCard>

            {foersteFravaersdag && (
                <ExpansionCard className="mb-8" size="small" aria-label="Informasjon om bestemmende fraværsdag">
                    <ExpansionCard.Header>
                        <ExpansionCard.Title size="small" as="h2">
                            Bestemmende fraværsdag: {toReadableDate(foersteFravaersdag)}
                        </ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <BodyShort>
                            Bestemmende fraværsdag er den dagen sykepenger beregnes fra. Det er kun inntekt du har hatt
                            før denne dagen som skal være med i beregningen.
                        </BodyShort>
                    </ExpansionCard.Content>
                </ExpansionCard>
            )}
        </>
    )
}
