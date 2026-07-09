import { BodyLong, BodyShort, Heading, Link, ReadMore } from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import React from 'react'

import { capitalizeFirstLetter, getManedsNavn } from '../../utils/dato-utils'
import { formatterTall } from '../../utils/tall-utils'
import { Inntekt } from '../../pages/beskjed/[id]'

interface InntektListeProps {
    grupperteInntekter: Record<string, Inntekt[]>
    orgnavn: string
}

const MaanedsInntekt = ({ maned, belop }: { maned: string; belop: number | null }) => (
    <div>
        <BodyShort>
            <span className="font-semibold">{capitalizeFirstLetter(getManedsNavn(maned))}:</span>{' '}
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
                <MaanedsInntekt key={maned} maned={maned} belop={belop} />
            ))}
    </div>
)

export const ForelagteInntektInfoBoks = ({ grupperteInntekter, orgnavn }: InntektListeProps) => {
    return (
        <div>
            <Heading level="2" size="medium" spacing>
                Inntekt hos {orgnavn}
            </Heading>

            <BodyShort className="mb-2">Hentet fra a-ordningen</BodyShort>

            <ReadMore className="mb-6" header="Om a-ordningen">
                <BodyLong>
                    A-ordningen er et offentlig register hvor arbeidsgivere sender inn opplysninger om sine ansatte. Nav
                    bruker opplysninger fra dette registeret til å blant annet behandle søknader om sykepenger.
                </BodyLong>
            </ReadMore>

            {Object.entries(grupperteInntekter)
                .sort(([aar1], [aar2]) => parseInt(aar1) - parseInt(aar2))
                .map(([aar, maneder]) => (
                    <InnhentetInntektForAar key={aar} aar={aar} maneder={maneder} />
                ))}

            <BodyShort>
                Inntekten vist er før skatt. Les mer om{' '}
                <Link
                    href="https://www.nav.no/arbeidsgiver/inntektsmelding#manedsinntekten"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    hvilke inntekter som inngår i beløpene <ExternalLinkIcon aria-hidden={true} />
                </Link>
                .
            </BodyShort>
        </div>
    )
}
