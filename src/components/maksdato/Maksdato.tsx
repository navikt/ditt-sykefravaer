import { ExpansionCard, BodyLong } from '@navikt/ds-react'
import React from 'react'

const Maksdato = () => {
    return (
        <ExpansionCard size="small" className="mt-8" aria-label="Demo med bare tittel">
            <ExpansionCard.Header>
                <ExpansionCard.Title>Din maksdato er 17. des. 2024 </ExpansionCard.Title>
                <ExpansionCard.Description>per 3. april. 2024</ExpansionCard.Description>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <BodyLong spacing>
                    Du kan som regel være sykmeldt med rett til sykepenger inntil 248 dager (52 uker) over en periode på
                    tre år. Dette er også kjent som maksdato. Datoen gjelder hvis du er sykmeldt uten opphold. Den vil
                    flytte seg hvis du for eksempel ikke er sykmeldt, eller hvis du tar ferie.
                </BodyLong>

                <BodyLong spacing>
                    Ved sykdom utover 52 uker, kan overgang til arbeidsavklaringspenger (AAP) være aktuelt.{' '}
                    <a href="https://www.nav.no/sykepenger#hvor-lenge" target="_blank">
                        {' '}
                        Les mer her
                    </a>
                </BodyLong>

                <BodyLong spacing>
                    Perioder hvor du har fått sykepenger fra NAV over de siste tre årene kan legges sammen hvis det er
                    mindre enn 26 uker mellom fraværene. Etter utløpt maksdato, må det gå 26 uker uten sykepenger eller
                    AAP før du eventuelt kan motta sykepenger igjen.
                </BodyLong>

                <BodyLong>
                    Spesielle regler gjelder for personer mellom 67 og 70 år.
                    <a href="https://lovdata.no/nav/folketrygdloven/kap8/%C2%A78-12" target="_blank">
                        {' '}
                        folketrygdloven § 8-12
                    </a>
                    , andre avsnitt
                </BodyLong>
            </ExpansionCard.Content>
        </ExpansionCard>
    )
}

export default Maksdato
