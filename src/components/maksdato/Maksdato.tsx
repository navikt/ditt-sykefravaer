import { ExpansionCard, BodyLong } from '@navikt/ds-react'
import React from 'react'

const Maksdato = () => {
    return (
        <ExpansionCard size="small" className="mt-8" aria-label="Demo med bare tittel">
            <ExpansionCard.Header>
                <ExpansionCard.Title>Din maksdato er 17. des. 2024</ExpansionCard.Title>
                <ExpansionCard.Description>Du har nå vært sykmeldt i 30 uker</ExpansionCard.Description>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <BodyLong spacing>
                    Som ansatt har du rett til sykepenger i opptil 52 uker over en periode på 18 måneder, også kjent som
                    maksdatoen for sykepenger. Når du nærmer deg denne grensen og fortsatt er syk, vil ikke
                    arbeidsgiveren din lenger få refusjon fra NAV for dine sykepenger.
                </BodyLong>

                <BodyLong spacing>
                    Ved sykdom utover 52 uker, kan overgang til arbeidsavklaringspenger (AAP) være aktuelt. Det er
                    viktig å merke seg at sykefravær over de siste tre årene kan legges sammen hvis det er mindre enn 26
                    uker mellom fraværene. Etter utløpt maksdato, må det gå 26 uker uten sykepenger eller AAP før du
                    eventuelt kan motta sykepenger igjen. Spesielle regler gjelder for personer mellom 67 og 70 år.
                </BodyLong>

                <BodyLong>
                    For mer detaljert informasjon les
                    <a href="https://www.nav.no/sykepenger#hvor-lenge" target="_blank">
                        {' '}
                        syk lenger enn 52 uker
                    </a>
                </BodyLong>
            </ExpansionCard.Content>
        </ExpansionCard>
    )
}

export default Maksdato
