import { Alert, BodyLong, BodyShort, Heading, Label, Skeleton } from '@navikt/ds-react'
import React from 'react'

import { Inntektsmelding } from '../../types/inntektsmelding'

import { Person } from './Person'
import Skillelinje from './Skillelinje/Skillelinje'
import Heading2 from './Heading2/Heading2'
import Heading3 from './Heading3'
import PeriodeFraTil from './PeriodeFraTil/PeriodeFraTil'
import formatCurrency from './formatCurrency'
import { formatDateFromString } from './formatDate'

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding?: Inntektsmelding }) {
    const ingenArbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder.length === 0
    const arbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder

    return (
        <>
            <Heading level="1" size="large" spacing>
                {inntektsmelding?.organisasjonsnavn}
            </Heading>
            <Alert variant="info" className="mb-4">
                Hvis du finner feil i denne informasjonen, kontakt din arbeidsgiver slik at de kan sende en ny
                inntektsmelding
            </Alert>

            <div>
                <Person inntektsmelding={inntektsmelding} />
                <Skillelinje />
                <div>
                    <div>
                        <div>
                            <Heading2>Bestemmende fraværsdag</Heading2>
                            <BodyShort spacing>
                                Bestemmende fraværsdag angir den dato som sykelønn skal beregnes utfra.
                            </BodyShort>
                            <Label>Dato</Label>
                            <BodyShort>
                                {inntektsmelding?.foersteFravaersdag ? (
                                    formatDateFromString(inntektsmelding.foersteFravaersdag)
                                ) : (
                                    <Skeleton variant="text" />
                                )}
                            </BodyShort>

                            <div className="mt-4">
                                <Heading2>Arbeidsgiverperiode</Heading2>
                                {!ingenArbeidsgiverperioder && (
                                    <BodyLong>
                                        Arbeidsgiver er ansvarlig for å betale ut lønn til den sykmeldte under
                                        arbeidsgiverpeioden. Deretter betaler Nav lønn til den syke eller refunderer
                                        bedriften.
                                    </BodyLong>
                                )}
                                {ingenArbeidsgiverperioder && <BodyLong>Det er ikke arbeidsgiverperiode.</BodyLong>}
                                {arbeidsgiverperioder?.map((periode, i) => (
                                    <PeriodeFraTil fom={periode.fom} tom={periode.tom} key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <Skillelinje />
                <Heading2>Beregnet månedslønn</Heading2>
                <BodyShort>Registrert inntekt</BodyShort>
                <BodyShort>{inntektsmelding?.beregnetInntekt} kr/måned</BodyShort>
                {/*    {bruttoinntekt.endringsaarsak && (
                    <>
                        <div>Endret med årsak</div>
                        {formatBegrunnelseEndringBruttoinntekt(bruttoinntekt.endringsaarsak)}
                        <EndringAarsakVisning
                            endringsaarsak={bruttoinntekt.endringsaarsak}
                            ferie={ferie}
                            lonnsendringsdato={lonnsendringsdato}
                            permisjon={permisjon}
                            permittering={permittering}
                            nystillingdato={nystillingdato}
                            nystillingsprosentdato={nystillingsprosentdato}
                            tariffendringDato={tariffendringsdato}
                            tariffkjentdato={tariffkjentdato}
                            sykefravaer={sykefravaerperioder}
                        />
                    </>
                )}
                <Skillelinje />
                <Heading2>Refusjon</Heading2>
                {visFullLonnIArbeidsgiverperioden && (
                    <>
                        <div>Betaler arbeidsgiver ut full lønn til arbeidstaker i arbeidsgiverperioden?</div>
                        <FullLonnIArbeidsgiverperioden lonnIPerioden={fullLonnIArbeidsgiverPerioden!} />
                    </>
                )}
                <div>Betaler arbeidsgiver lønn og krever refusjon etter arbeidsgiverperioden?</div>
                <LonnUnderSykefravaeret
                    lonn={lonnISykefravaeret!}
                    refusjonskravetOpphoerer={refusjonskravetOpphoerer}
                    harRefusjonEndringer={harRefusjonEndringer}
                    refusjonEndringer={refusjonEndringer}
                />
                {visNaturalytelser && (
                    <>
                        <Skillelinje />
                        <Heading2>Eventuelle naturalytelser</Heading2>
                        <BortfallNaturalytelser ytelser={naturalytelser!} />
                    </>
                )}
                <Skillelinje />
                <BodyShort>Kvittering - innsendt inntektsmelding{innsendingstidspunkt}</BodyShort> */}
            </div>
            <Skillelinje />
            <BodyShort spacing className="italic text-gray-600">
                {'Inntektsmelding innstendt: ' + inntektsmelding?.mottattDato}
            </BodyShort>
        </>
    )
}
