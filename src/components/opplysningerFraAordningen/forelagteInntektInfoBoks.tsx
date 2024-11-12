import { Box, BodyShort, Heading, BodyLong } from '@navikt/ds-react'

import { capitalizeFirstLetter, getManedsNavn } from '../../utils/dato-utils'
import { formatterTall } from '../../utils/tall-utils'
import { Inntekt } from '../../pages/beskjed/[id]'

interface InntektListeProps {
    grupperteInntekter: Record<string, Inntekt[]>
}

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
                Inntekt hentet fra A-ordningen
            </Heading>

            {Object.entries(grupperteInntekter).map(([aar, maneder]) => (
                <div key={aar} className="mb-5">
                    <BodyShort weight="semibold">{aar}</BodyShort>
                    {maneder.map(({ maned, belop }) => (
                        <div key={`${aar}-${maned}`}>
                            <BodyShort>
                                <BodyShort as="span" weight="semibold">
                                    {capitalizeFirstLetter(getManedsNavn(maned))}:
                                </BodyShort>{' '}
                                {belop !== null ? `${formatterTall(belop)} kroner` : 'Ingen inntekt registrert'}
                            </BodyShort>
                        </div>
                    ))}
                </div>
            ))}

            <BodyShort className="italic">Inntekten vist er før skatt</BodyShort>
        </Box>
    )
}
