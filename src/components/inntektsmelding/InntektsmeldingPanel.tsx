import { Panel, BodyShort, Heading, ExpansionCard } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'

import { formatDateFromString } from './formatDate'

export function InntektsmeldingPanel({ inntektsmelding = null }: { inntektsmelding?: InntektsmeldingTyper | null }) {
    const { organisasjonsnavn, mottattDato, innsenderFulltNavn, foersteFravaersdag, beregnetInntekt } =
        inntektsmelding || {}

    const renderInnsendtInfo = () => {
        const nameInfo = innsenderFulltNavn ? `Innsendt av ${innsenderFulltNavn}` : ''
        const dateInfo = mottattDato ? `${formatDateFromString(mottattDato)}` : ''

        const info = [nameInfo, dateInfo].filter(Boolean).join(', ')

        return info ? <BodyShort spacing>{info}</BodyShort> : null
    }

    const expansionCardStyle = {
        '--ac-expansioncard-header-bg': 'var(--a-gray-50)',
        '--ac-expansioncard-header-open-bg': 'var(--a-gray-50)',
        '--ac-expansioncard-border-color': 'transparent',
        '--ac-expansioncard-border-open-color': 'transparent',
        '--ac-expansioncard-border-hover-color': 'transparent',
    } as React.CSSProperties

    return (
        <Panel className="mt-4 rounded-md border-2 border-gray-300" border>
            <Heading level="2" size="small" className="mt-2 mb-2">
                Inntektsmelding fra {organisasjonsnavn}
            </Heading>

            {renderInnsendtInfo()}

            {foersteFravaersdag && (
                <ExpansionCard className="mb-8 mt-8" size="small" aria-label="Small-variant" style={expansionCardStyle}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title size="small">
                            <BodyShort weight="semibold">
                                Bestemmende fraværsdag: {formatDateFromString(foersteFravaersdag)}
                            </BodyShort>
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

            <ExpansionCard size="small" aria-label="Small-variant" className="mb-4" style={expansionCardStyle}>
                <ExpansionCard.Header>
                    <ExpansionCard.Title size="small">
                        <BodyShort weight="semibold">Beregnet månedsinntekt: {beregnetInntekt} kr</BodyShort>
                    </ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <BodyShort>
                        Beregnet månedsinntekt er den inntekten som sykepenger regnes ut fra. Dette skal som regel være
                        gjennomsnittet av inntekten din de siste tre kalendermånedene før sykefraværet startet.
                    </BodyShort>
                </ExpansionCard.Content>
            </ExpansionCard>
        </Panel>
    )
}

InntektsmeldingPanel.defaultProps = {
    inntektsmelding: null,
}
