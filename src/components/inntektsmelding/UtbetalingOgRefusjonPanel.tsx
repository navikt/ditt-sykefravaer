import { BodyLong, BodyShort, Box, Heading, Label, ReadMore } from '@navikt/ds-react'
import React from 'react'
import { logger } from '@navikt/next-logger'

import { InntektsmeldingTyper } from '../../types/inntektsmeldingTyper'
import { toReadableDate } from '../../utils/dateUtils'

import formatCurrency from './formatCurrency'

export function UtbetalingOgRefusjonPanel({
    inntektsmelding = null,
}: {
    inntektsmelding?: InntektsmeldingTyper | null
}) {
    const erRefusjon = inntektsmelding?.refusjon?.beloepPrMnd && Number(inntektsmelding?.refusjon.beloepPrMnd) > 0
    const visEndringerIRefusjon = (inntektsmelding?.endringIRefusjoner?.length || 0) > 0

    return (
        <Box className="mt-8" padding="4" borderWidth="1" borderRadius="8" borderColor="border-default">
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
                    <BodyLong spacing>
                        {begrunnelseTilBegrunnelsetekst(inntektsmelding.begrunnelseForReduksjonEllerIkkeUtbetalt)}
                    </BodyLong>

                    {inntektsmelding?.bruttoUtbetalt && (
                        <>
                            <Label as="p">Brutto utbetalt under arbeidsgiverperiode</Label>
                            <BodyLong spacing>{formatCurrency(inntektsmelding?.bruttoUtbetalt)} kr</BodyLong>
                        </>
                    )}
                </div>
            )}
            <Label className="mt-8" as="p">
                Betaler arbeidsgiver ut lønn etter arbeidsgiverperioden?
            </Label>
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
                            <BodyShort spacing>Dato for endring: {toReadableDate(endring.endringsdato)}</BodyShort>
                            <BodyShort className="mb-8">Nytt beløp: {formatCurrency(endring.beloep)} kr/mnd</BodyShort>
                        </div>
                    ))}
                </>
            )}
            {inntektsmelding?.refusjon?.opphoersdato && (
                <Box padding="4" borderRadius="8" background="bg-subtle">
                    <Label className="mt-4" as="p">
                        Siste dag arbeidsgiver betaler lønn:
                    </Label>
                    <BodyShort spacing>{toReadableDate(inntektsmelding?.refusjon.opphoersdato)}</BodyShort>
                    <BodyShort className="mt-8" spacing>
                        NAV betaler direkte til deg etter denne datoen
                    </BodyShort>
                </Box>
            )}
        </Box>
    )
}

function begrunnelseTilBegrunnelsetekst(begrunnelse: string) {
    const begrunnelseIngenEllerRedusertUtbetalingListe: {
        [key: string]: string
    } = {
        LovligFravaer: 'Lovlig fravær uten lønn ',
        FravaerUtenGyldigGrunn: 'Ikke lovlig fravær',
        ArbeidOpphoert: 'Arbeidsforholdet er avsluttet',
        BeskjedGittForSent: 'Beskjed om fravær gitt for sent eller sykmeldingen er ikke sendt i tide',
        ManglerOpptjening: 'Det er ikke fire ukers opptjeningstid',
        IkkeLoenn: 'Det er ikke avtale om videre arbeid',
        BetvilerArbeidsufoerhet: 'Vi betviler at ansatt er ute av stand til å jobbe',
        IkkeFravaer: 'Ansatt har ikke hatt fravær fra jobb',
        StreikEllerLockout: 'Streik eller lockout',
        Permittering: 'Ansatt er helt eller delvis permittert',
        FiskerMedHyre: 'Ansatt er fisker med hyre på blad B',
        Saerregler: 'Ansatt skal være donor eller skal til kontrollundersøkelse som varer i mer enn 24 timer',
        FerieEllerAvspasering:
            'Mindre enn 16 dager siden arbeidet ble gjenopptatt på grunn av lovpålagt ferie eller avspasering',
        IkkeFullStillingsandel: 'Ansatt har ikke gjenopptatt full stilling etter forrige arbeidsgiverperiode',
        TidligereVirksomhet: 'Arbeidsgiverperioden er helt eller delvis gjennomført hos tidligere virksomhet ',
    }
    if (begrunnelseIngenEllerRedusertUtbetalingListe[begrunnelse]) {
        return begrunnelseIngenEllerRedusertUtbetalingListe[begrunnelse]
    }
    logger.error(`Begrunnelse ${begrunnelse} ikke funnet i begrunnelseIngenEllerRedusertUtbetalingListe`)
    return begrunnelse
}
