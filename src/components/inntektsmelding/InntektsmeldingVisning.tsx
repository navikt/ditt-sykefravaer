import { BodyLong, BodyShort, Heading, Label, Table } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper, naturalytelser } from '../../types/inntektsmeldingTyper'
import { Feedback } from '../feedback/feedback'
import { Banner } from '../banner/Banner'

import PeriodeFraTil from './PeriodeFraTil/PeriodeFraTil'
import { formatDateFromString, formatTime } from './formatDate'
import formatCurrency from './formatCurrency'

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding?: InntektsmeldingTyper }) {
    const ingenArbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder.length === 0
    const arbeidsgiverperioder = inntektsmelding?.arbeidsgiverperioder
    const visNaturalytelser = (inntektsmelding?.opphoerAvNaturalytelser?.length || 0) > 0
    const erRefusjon = inntektsmelding?.refusjon?.beloepPrMnd && Number(inntektsmelding?.refusjon.beloepPrMnd) > 0
    const visEndringerIRefusjon = (inntektsmelding?.endringIRefusjoner?.length || 0) > 0
    return (
        <>
            <Banner tittel="Inntektsmelding" utenIkon={true}></Banner>

            <BodyLong spacing>
                For å bestemme din rett til sykepenger og korrekt beregne ditt sykepengegrunnlag, har din arbeidsgiver
                sendt oss informasjon om inntekten og arbeidsforholdet ditt. Hvis du har spørsmål til de opplysningene
                du ser her, eller noe er feil, må du kontakte arbeidsgiveren din.
            </BodyLong>

            <Heading level="2" size="medium" spacing className="mt-8">
                Arbeidsgiveren
            </Heading>

            <Label as="p">Virksomhetsnavn</Label>
            <BodyLong spacing>{inntektsmelding?.organisasjonsnavn}</BodyLong>

            {inntektsmelding?.innsenderFulltNavn && (
                <>
                    <Label as="p">Innsender</Label>
                    <BodyLong spacing>{inntektsmelding?.innsenderFulltNavn}</BodyLong>
                </>
            )}

            {inntektsmelding?.foersteFravaersdag && (
                <>
                    <Heading size="medium" level="2" className="mt-8">
                        Bestemmende fraværsdag
                    </Heading>
                    <BodyLong spacing>
                        Bestemmende fraværsdag er den dagen sykepenger beregnes fra. Det er kun inntekt du har hatt før
                        denne dagen som skal være med i beregningen.
                    </BodyLong>
                    <Label as="p">Dato</Label>
                    <BodyLong>{formatDateFromString(inntektsmelding?.foersteFravaersdag)}</BodyLong>
                </>
            )}
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
            <Label as="p">Registrert inntekt</Label>
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

            {inntektsmelding?.begrunnelseForReduksjonEllerIkkeUtbetalt && (
                <>
                    <Label as="p">Betaler arbeidsgiver ut full lønn i arbeidsgiverperioden?</Label>
                    <BodyLong spacing>Nei</BodyLong>

                    <Label as="p">Begrunnelse</Label>
                    <BodyLong spacing>{inntektsmelding?.begrunnelseForReduksjonEllerIkkeUtbetalt}</BodyLong>

                    {inntektsmelding?.bruttoUtbetalt && (
                        <>
                            <Label as="p">Brutto utbetalt under arbeidsgiverperiode</Label>
                            <BodyLong spacing>{formatCurrency(inntektsmelding?.bruttoUtbetalt)} kr</BodyLong>
                        </>
                    )}
                </>
            )}
            <Label as="p">Betaler arbeidsgiver ut lønn etter arbeidsgiverperioden?</Label>
            <BodyLong spacing>{erRefusjon ? 'Ja' : 'Nei, sykepengene blir betalt direkte til deg'}</BodyLong>

            {erRefusjon && (
                <>
                    <Label as="p">Månedslønn til arbeidstaker under sykefravær</Label>
                    <BodyLong spacing>{formatCurrency(inntektsmelding?.refusjon.beloepPrMnd)} kr/måned</BodyLong>
                </>
            )}

            {visEndringerIRefusjon && (
                <>
                    <Label as="p">Er det endringer i utbetaling til arbeidstaker under sykefravær?</Label>
                    <BodyLong spacing>Ja</BodyLong>
                    {inntektsmelding?.endringIRefusjoner?.map((endring, i) => (
                        <div key={i}>
                            <div className="w-1/2 inline-block">
                                <Label as="p">Dato for endring</Label>
                                <BodyLong spacing>{formatDateFromString(endring.endringsdato)}</BodyLong>
                            </div>
                            <div className="w-1/2 inline-block">
                                <Label as="p">Nytt beløp</Label>
                                <BodyLong spacing>{formatCurrency(endring.beloep)} kr/måned</BodyLong>
                            </div>
                        </div>
                    ))}
                </>
            )}
            {inntektsmelding?.refusjon?.opphoersdato && (
                <>
                    <Label as="p">Siste dag arbeidsgiver betaler lønn</Label>
                    <BodyShort>{formatDateFromString(inntektsmelding?.refusjon.opphoersdato)}</BodyShort>
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
                            {inntektsmelding?.opphoerAvNaturalytelser?.map((naturalytelse, i) => {
                                if (!naturalytelse.naturalytelse) return null
                                if (!naturalytelse.fom) return null
                                if (!naturalytelse.beloepPrMnd) return null
                                return (
                                    <Table.Row key={i}>
                                        <Table.DataCell>
                                            {naturalytelser[naturalytelse.naturalytelse] || 'Annet'}
                                        </Table.DataCell>
                                        <Table.DataCell>{formatDateFromString(naturalytelse.fom)}</Table.DataCell>
                                        <Table.DataCell>
                                            {formatCurrency(naturalytelse.beloepPrMnd)} kr/måned
                                        </Table.DataCell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </>
            )}

            {inntektsmelding?.mottattDato && (
                <BodyLong spacing className="text-gray-600 mt-12">
                    {`Inntektsmelding innsendt ${formatDateFromString(inntektsmelding?.mottattDato)} kl. ${formatTime(
                        inntektsmelding?.mottattDato,
                    )}`}
                </BodyLong>
            )}
            <Feedback feedbackId="inntektsmelding-visning" />
        </>
    )
}
