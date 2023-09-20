import { BodyLong, BodyShort, Heading, Label, Table } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper, naturalytelser } from '../../types/inntektsmeldingTyper'
import { Feedback } from '../feedback/feedback'

import PeriodeFraTil from './PeriodeFraTil/PeriodeFraTil'
import { formatDateFromString } from './formatDate'

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding?: InntektsmeldingTyper }) {
    const ingenArbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder.length === 0
    const arbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder
    const visNaturalytelser = (inntektsmelding?.opphoerAvNaturalytelser?.length || 0) > 0
    const erRefusjon = inntektsmelding?.refusjon?.beloepPrMnd
    const visEndringerIRefusjon = (inntektsmelding?.endringIRefusjoner?.length || 0) > 0
    return (
        <>
            <Heading level="1" size="large" spacing>
                Inntektsmelding
            </Heading>

            <BodyLong spacing>
                For å bestemme din rett til sykepenger og korrekt beregne ditt sykepengegrunnlag, har din arbeidsgiver
                sendt oss informasjon om inntekten og arbeidsforholdet ditt. Hvis du har spørsmål til de opplysningene
                du ser her, eller noe er feil, må du kontakte arbeidsgiveren din.
            </BodyLong>

            <Heading level="2" size="medium" spacing className="mt-8">
                Arbeidsgiveren
            </Heading>

            <div className="w-1/2 inline-block">
                <Label>Virksomhetsnavn</Label>
                <BodyLong spacing>{inntektsmelding?.organisasjonsnavn}</BodyLong>
            </div>
            <div className="w-1/2 inline-block">
                <Label>Innsender</Label>
                <BodyLong spacing>{inntektsmelding?.innsenderNavn}</BodyLong>
            </div>

            <Heading size="medium" level="2" className="mt-8">
                Bestemmende fraværsdag
            </Heading>
            <BodyLong spacing>
                Bestemmende fraværsdag er den dagen sykepenger beregnes fra. Det er kun inntekt du har hatt før denne
                dagen som skal være med i beregningen.
            </BodyLong>
            <Label>Dato</Label>
            <BodyLong>{formatDateFromString(inntektsmelding?.foersteFravaersdag)}</BodyLong>

            {!ingenArbeidsgiverperioder && (
                <>
                    <Heading size="medium" level="2" className="mt-8">
                        Arbeidsgiverperiode
                    </Heading>
                    <BodyLong>
                        Arbeidsgiveren din er vanligvis ansvarlig for å betale sykepenger til deg de første 16
                        kalenderdagene av sykefraværet ditt. Etter dette overtar NAV betalingen til deg eller din
                        arbeidsgiver hvis du har rett til sykepenger.
                    </BodyLong>
                    {arbeidsgiverperioder?.map((periode, i) => (
                        <PeriodeFraTil fom={periode.fom} tom={periode.tom} key={i} />
                    ))}
                </>
            )}

            <Heading size="medium" level="2" className="mt-8" spacing>
                Beregnet månedsinntekt
            </Heading>
            <BodyLong spacing>
                Beregnet månedsinntekt er den inntekten som sykepenger regnes ut fra. Dette skal som regel være
                gjennomsnittet av inntekten din de siste tre kalendermånedene før sykefraværet startet. Hvis du er
                usikker på om månedsinntekten er riktig, kontakt arbeidsgiveren din.
            </BodyLong>
            <Label>Registrert inntekt</Label>
            <BodyLong>{inntektsmelding?.beregnetInntekt} kr/måned</BodyLong>

            <Heading size="medium" level="2" className="mt-8">
                Utbetaling og refusjon
            </Heading>
            <BodyLong spacing>
                Hvis sykefraværet ditt overstiger 16 kalenderdager og du har rett til sykepenger, vil NAV stå for
                utbetalingen av sykepenger. Noen arbeidsgivere betaler fortsatt sykepenger fra dag 17, men de vil senere
                bli refundert av NAV. Nedenfor ser du om sykepengene blir betalt direkte til deg eller om de blir sendt
                til arbeidsgiveren din.
            </BodyLong>
            <Label>Betaler arbeidsgiver ut lønn etter arbeidsgiverperioden?</Label>
            <BodyLong spacing>{erRefusjon ? 'Ja' : 'Nei, sykepengene blir betalt direkte til deg'}</BodyLong>

            {erRefusjon && (
                <>
                    <Label>Månedslønn til arbeidstaker under sykefravær</Label>
                    <BodyLong spacing>{inntektsmelding?.refusjon?.beloepPrMnd} kr/måned</BodyLong>
                </>
            )}

            {visEndringerIRefusjon && (
                <>
                    <Label>Er det endringer i utbetaling til arbeidstaker under sykefravær?</Label>
                    <BodyLong spacing>Ja</BodyLong>
                    {inntektsmelding?.endringIRefusjoner?.map((endring, i) => (
                        <div key={i}>
                            <div className="w-1/2 inline-block">
                                <Label>Dato for endring</Label>
                                <BodyLong spacing>{formatDateFromString(endring.endringsdato)}</BodyLong>
                            </div>
                            <div className="w-1/2 inline-block">
                                <Label>Nytt beløp</Label>
                                <BodyLong spacing>{endring.beloep} kr/måned</BodyLong>
                            </div>
                        </div>
                    ))}
                </>
            )}
            {inntektsmelding?.refusjon?.opphoersdato && (
                <>
                    <Label>Siste dag arbeidsgiver betaler lønn</Label>
                    <BodyShort>{formatDateFromString(inntektsmelding.refusjon.opphoersdato)}</BodyShort>
                    <BodyLong spacing>NAV betaler direkte til deg etter dette.</BodyLong>
                </>
            )}
            {visNaturalytelser && (
                <>
                    <Heading size="medium" level="2" className="mt-8">
                        Naturalytelser
                    </Heading>
                    <Table size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Naturalytelse</Table.HeaderCell>
                                <Table.HeaderCell>Dato naturalytelse bortfaller</Table.HeaderCell>
                                <Table.HeaderCell>Verdi naturalytelse - kr/måned</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {inntektsmelding?.opphoerAvNaturalytelser?.map((naturalytelse, i) => (
                                <Table.Row key={i}>
                                    <Table.DataCell>
                                        {naturalytelser[naturalytelse.naturalytelse] || 'Annet'}
                                    </Table.DataCell>
                                    <Table.DataCell>{formatDateFromString(naturalytelse.fom)}</Table.DataCell>
                                    <Table.DataCell>{naturalytelse.beloepPrMnd} kr/måned</Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </>
            )}

            <BodyLong spacing className="italic text-gray-600 mt-12">
                {'Inntektsmelding innsendt ' + formatDateFromString(inntektsmelding?.mottattDato)}
            </BodyLong>
            <Feedback />
        </>
    )
}
