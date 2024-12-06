import { Box, BodyShort, Heading, ReadMore } from '@navikt/ds-react'
import React from 'react'

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
            <Heading level="2" size="small" spacing>
                Inntekt hentet fra a-ordningen
            </Heading>

            {Object.entries(grupperteInntekter)
                .sort(([aar1], [aar2]) => parseInt(aar1) - parseInt(aar2))
                .map(([aar, maneder]) => (
                    <InnhentetInntektForAar key={aar} aar={aar} maneder={maneder} />
                ))}

            <BodyShort className="italic">Inntekten vist er før skatt</BodyShort>

            <ReadMore className="mt-4" header="Hva er a-ordningen?">
                A-ordningen er et offentlig register hvor arbeidsgivere sender inn opplysninger om sine ansatte. Nav
                bruker opplysninger fra dette registeret til å blant annet behandle søknader om sykepenger.
            </ReadMore>
        </Box>
    )
}
