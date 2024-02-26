import { ExpansionCard, BodyLong } from '@navikt/ds-react'
import React from 'react'

import useMaxDate from '../../hooks/useMaxDate'
import { formatDateFromString } from '../inntektsmelding/formatDate'

const Maksdato = () => {
    const { data: maxdate } = useMaxDate()

    const sisteUbetaling = formatDateFromString(maxdate?.utbetaltTom ?? '')
    const maksdato = formatDateFromString(maxdate?.maxDate ?? '')

    if (sisteUbetaling === '' && maksdato === '') {
        return null
    }

    return (
        <ExpansionCard size="small" className="mt-8" aria-label="Demo med bare tittel">
            <ExpansionCard.Header>
                <ExpansionCard.Title size="small">Beregnet slutt på sykepenger</ExpansionCard.Title>
                <ExpansionCard.Description>
                    Maksdato per {sisteUbetaling} er {maksdato}
                </ExpansionCard.Description>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <BodyLong spacing>
                    Du kan maksimalt få sykepenger fra NAV i 52 uker. Grensen er den samme enten du er helt eller delvis
                    sykmeldt og kalles også maksdato. Datoen gjelder hvis du er sammenhengende sykmeldt. Den vil flytte
                    seg hvis du for eksempel ikke får sykepenger fra NAV i perioder, eller hvis du tar ferie.
                </BodyLong>

                <BodyLong spacing>
                    Sykefravær inntil 3 år tilbake i tid blir lagt sammen hvis det er mindre enn 26 uker mellom noen av
                    fraværene.
                </BodyLong>

                <BodyLong spacing>
                    Hvis du har brukt opp de 52 ukene, må det gå 26 uker uten sykepenger eller Arbeidsavklaringspenger
                    (AAP) før du kan få sykepenger igjen, du kan lese mer om dette i
                    <a href="https://lovdata.no/nav/folketrygdloven/kap8/%C2%A78-12" target="_blank">
                        {' '}
                        folketrygdloven § 8-12.
                    </a>{' '}
                    Blir du syk på nytt før disse ukene har gått, kan det være aktuelt med AAP som erstatning for
                    sykepenger. Ta gjerne kontakt med NAV eller snakk med veilederen din om dette.
                </BodyLong>

                <BodyLong spacing>
                    <a href="https://www.nav.no/sykepenger#mellom-67-og-70" target="_blank">
                        {' '}
                        Det er egne regler for deg som er mellom 67 og 70 år.
                    </a>
                </BodyLong>

                <BodyLong>
                    Hvis du har fått sykepenger i 52 uker og fortsatt ikke kan arbeide på grunn av sykdom eller skade,
                    kan du ha rett til arbeidsavklaringspenger eller uføretrygd.
                    <a href="https://www.nav.no/sykepenger#nar-det-snart-er-slutt-pa-sykepengene" target="_blank">
                        {' '}
                        Les mer om mulighetene dine etter det er slutt på sykepengene.
                    </a>
                </BodyLong>
            </ExpansionCard.Content>
        </ExpansionCard>
    )
}

export default Maksdato
