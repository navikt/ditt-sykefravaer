import { BodyLong, Heading, Label } from '@navikt/ds-react'
import React from 'react'

import { Inntektsmelding } from '../../types/inntektsmelding'

import PeriodeFraTil from './PeriodeFraTil/PeriodeFraTil'
import { formatDateFromString } from './formatDate'

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding?: Inntektsmelding }) {
    const ingenArbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder.length === 0
    const arbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder

    return (
        <>
            <Heading level="1" size="large" spacing>
                {'Inntektsmelding' + ' - ' + formatDateFromString(inntektsmelding?.foersteFravaersdag)}
            </Heading>

            <BodyLong spacing>
                For at vi skal utbetale riktig beløp i forbindelse med sykmelding, har arbeidsgiveren sendt inn de
                opplysningene de har om den ansatte og sykefraværet. Hvis du finner opplysninger som må oppdateres må du
                kontakte arbeidsgiveren.
            </BodyLong>

            <Heading level="2" size="medium" spacing className="mt-8">
                Arbeidsgiveren
            </Heading>

            <Label>Virksomhetsnavn</Label>
            <BodyLong spacing>{inntektsmelding?.organisasjonsnavn}</BodyLong>

            <Label>Innsender</Label>
            <BodyLong spacing>{inntektsmelding?.innsenderNavn}</BodyLong>

            <Heading size="medium" level="2" className="mt-8">
                Bestemmende fraværsdag
            </Heading>
            <BodyLong spacing>
                Bestemmende fraværsdag angir det datumet som sykelønn beregnes utfra, og er den første dagen i den siste
                perioden i sykefraværet.
            </BodyLong>
            <Label>Dato</Label>
            <BodyLong>{formatDateFromString(inntektsmelding?.foersteFravaersdag)}</BodyLong>

            <Heading size="medium" level="2" className="mt-8">
                Arbeidsgiverperiode
            </Heading>

            {!ingenArbeidsgiverperioder && (
                <BodyLong>
                    Arbeidsgiver er ansvarlig å betale ut lønn til den sykmeldte under arbeidsgiverperioden, deretter
                    betaler NAV lønn til den syke eller refunderer bedriften.
                </BodyLong>
            )}
            {ingenArbeidsgiverperioder && <BodyLong>Det er ikke arbeidsgiverperiode.</BodyLong>}
            {arbeidsgiverperioder?.map((periode, i) => <PeriodeFraTil fom={periode.fom} tom={periode.tom} key={i} />)}

            <Heading size="medium" level="2" className="mt-8" spacing>
                Beregnet månedslønn
            </Heading>
            <BodyLong spacing>
                Beregnet månedslønn er den lønn som sykepengene baseres på. Det er et snitt av de siste tre
                månedslønnene og skal speile det som du skulle få i lønn hvis du ikke var syk.
            </BodyLong>
            <Label>{`Registrert inntekt (per ${formatDateFromString(inntektsmelding?.mottattDato)})`}</Label>
            <BodyLong>{inntektsmelding?.beregnetInntekt} kr/måned</BodyLong>

            <Heading size="medium" level="2" className="mt-8">
                Utbetaling og refusjon
            </Heading>
            <BodyLong>
                Vi viser hvis det er arbeidsgiver eller Nav som betaler ut sykepenger. Hvis arbeidsgiver betaler ut
                sykepenger så vil Nav vanligvis refundere arbeidsgiver. Hvis ikke arbeidsgiver betaler så vil du
                vanligvis få sykepenger direkte fra Nav.
            </BodyLong>
            {/*
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
                */}
            <BodyLong spacing className="italic text-gray-600 mt-12">
                {'Inntektsmelding innstendt: ' + inntektsmelding?.mottattDato}
            </BodyLong>
        </>
    )
}