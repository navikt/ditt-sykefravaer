import { Panel, Heading, BodyLong, Label, BodyShort, ReadMore } from '@navikt/ds-react'
import React from 'react'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'

import { formatDateFromString } from './formatDate'
import formatCurrency from './formatCurrency'

export function UtbetalingOgRefusjonPanel({
    inntektsmelding = null,
}: {
    inntektsmelding?: InntektsmeldingTyper | null
}) {
    const erRefusjon = inntektsmelding?.refusjon?.beloepPrMnd && Number(inntektsmelding?.refusjon.beloepPrMnd) > 0
    const visEndringerIRefusjon = (inntektsmelding?.endringIRefusjoner?.length || 0) > 0

    return (
        <Panel className="mt-4 rounded-md border-2 border-gray-300" border>
            <Heading level="2" size="small" className="mt-2">
                Utbetaling og refusjon
            </Heading>
            <ReadMore className="mt-4" header="Les mer">
                Hvis sykefraværet ditt overstiger 16 kalenderdager og du har rett til sykepenger, vil NAV stå for
                utbetalingen av sykepenger. Noen arbeidsgivere betaler fortsatt sykepenger fra dag 17, men de vil senere
                bli refundert av NAV.
            </ReadMore>

            {inntektsmelding?.begrunnelseForReduksjonEllerIkkeUtbetalt && (
                <div className="mt-8">
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
                </div>
            )}
            <Label as="p">Betaler arbeidsgiver ut lønn etter arbeidsgiverperioden?</Label>
            <BodyLong spacing>{erRefusjon ? 'Ja' : 'Nei, sykepengene blir betalt direkte til deg'}</BodyLong>

            {erRefusjon && (
                <>
                    <Label as="p">Månedslønn til arbeidstaker under sykefravær</Label>
                    <BodyLong spacing>{formatCurrency(inntektsmelding?.refusjon.beloepPrMnd)} kr/mnd</BodyLong>
                </>
            )}

            {visEndringerIRefusjon && (
                <>
                    <Label as="p">Er det endringer i utbetaling til arbeidstaker under sykefravær?</Label>
                    <BodyLong spacing>Ja</BodyLong>
                    <Label as="p" spacing>
                        Endringer i utbetalinger:
                    </Label>
                    {inntektsmelding?.endringIRefusjoner?.map((endring, i) => (
                        <div key={i} className="border-b border-gray-400 mt-8 mb-8">
                            <BodyShort spacing>
                                Dato for endring: {formatDateFromString(endring.endringsdato)}
                            </BodyShort>
                            <BodyShort className="mb-8">Nytt beløp: {formatCurrency(endring.beloep)} kr/mnd</BodyShort>
                        </div>
                    ))}
                </>
            )}
            {inntektsmelding?.refusjon?.opphoersdato && (
                <Panel
                    className="rounded-md mb-4"
                    style={
                        {
                            '--ac-panel-bg': 'var(--a-gray-50)',
                        } as React.CSSProperties
                    }
                >
                    <Label className="mt-4" as="p">
                        Siste dag arbeidsgiver betaler lønn:
                    </Label>
                    <BodyShort spacing>{formatDateFromString(inntektsmelding?.refusjon.opphoersdato)}</BodyShort>
                    <BodyShort className="mt-8" spacing>
                        NAV betaler direkte til deg etter denne datoen
                    </BodyShort>
                </Panel>
            )}
        </Panel>
    )
}

UtbetalingOgRefusjonPanel.defaultProps = {
    inntektsmelding: null,
}
