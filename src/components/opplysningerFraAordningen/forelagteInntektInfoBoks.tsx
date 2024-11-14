import { Box, BodyShort, Heading, BodyLong } from '@navikt/ds-react'

import { capitalizeFirstLetter, getManedsNavn } from '../../utils/dato-utils'
import { formatterTall } from '../../utils/tall-utils'
import { Inntekt } from '../../pages/beskjed/[id]'

interface InntektListeProps {
    grupperteInntekter: Record<string, Inntekt[]>
}

const MaanedsInntekt = ({ aar, maned, belop }: { aar: string; maned: string; belop: number | null }) => (
    <div key={`${aar}-${maned}`}>
        <BodyShort>
            <BodyShort as="span" weight="semibold">
                {capitalizeFirstLetter(getManedsNavn(maned))}:
            </BodyShort>{' '}
            {belop !== null ? `${formatterTall(belop)} kroner` : 'Ingen inntekt registrert'}
        </BodyShort>
    </div>
)

const InnhentetInntektForAar = ({ aar, maneder }: { aar: string; maneder: Inntekt[] }) => (
    <div key={aar} className="mb-5">
        <BodyShort weight="semibold">{aar}</BodyShort>
        {maneder
            .sort((a, b) => parseInt(a.maned) - parseInt(b.maned))
            .map(({ maned, belop }) => (
                <MaanedsInntekt key={maned} aar={aar} maned={maned} belop={belop} />
            ))}
    </div>
)

export const ForelagteInntektInfoBoks = ({ grupperteInntekter }: InntektListeProps) => {
    return (
        <Box padding="6" borderRadius="small" className="my-8 bg-gray-50">
            <div className="border-b mb-8" style={{ borderColor: 'var(--a-grayalpha-500)' }}>
                <Heading level="2" size="medium" spacing>
                    Vi trenger at du sjekker om inntekten stemmer
                </Heading>

                <BodyLong spacing>
                    Nav bruker vanligvis gjennomsnittet av inntekten din fra de siste 3 månedene før du ble syk for å
                    beregne sykepengene dine. Hvis inntekten vi har hentet ikke stemmer med det du har tjent, må du gi
                    beskjed så vi kan ta det med i beregningen.
                </BodyLong>

                <BodyLong spacing>Hvis inntekten stemmer og alt ser greit ut, trenger du ikke gjøre noe.</BodyLong>
            </div>

            <Heading level="2" size="small" spacing>
                Inntekt hentet fra a-ordningen
            </Heading>

            {Object.entries(grupperteInntekter)
                .sort(([aar1], [aar2]) => parseInt(aar1) - parseInt(aar2))
                .map(([aar, maneder]) => (
                    <InnhentetInntektForAar key={aar} aar={aar} maneder={maneder} />
                ))}

            <BodyShort className="italic">Inntekten vist er før skatt</BodyShort>
        </Box>
    )
}
