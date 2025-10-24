import { ArbeidssituasjonType } from '../../../../types/sykmelding/sykmeldingCommon'
import { FormValues } from '../../../SendSykmelding/SendSykmeldingForm'
import { sporsmal } from '../../../../utils/sporsmal'
import { yesOrNoToJaEllerNei } from '../../../../server/sendSykmeldingMapping'
import { raise } from '../../../../utils/ts-utils'
import { mapToSendSykmeldingValues } from '../../../../utils/toSendSykmeldingUtils'
import { BrukerSvar } from '../../../../types/sykmelding/sykmeldingBrukerSvar'

export type SporsmaltekstMetadata = {
    sykmeldingId: string
    arbeidsgiverNavn: string | null
    narmestelederNavn: string | null
    sykmeldingStartDato: string
}

export function mapFormValuesToBrukerSvar(
    formValues: FormValues,
    metadata: SporsmaltekstMetadata,
): Omit<BrukerSvar, 'egenmeldingsperioder' | 'harBruktEgenmelding' | 'harForsikring'> {
    const sendSykmeldingValues = mapToSendSykmeldingValues(formValues)

    return {
        erOpplysningeneRiktige: sendSykmeldingValues.erOpplysningeneRiktige
            ? {
                  sporsmaltekst: sporsmal.erOpplysningeneRiktige,
                  svar: yesOrNoToJaEllerNei(sendSykmeldingValues.erOpplysningeneRiktige),
              }
            : raise('Er opplysningene riktige må være satt'),
        uriktigeOpplysninger: sendSykmeldingValues.uriktigeOpplysninger
            ? {
                  sporsmaltekst: sporsmal.uriktigeOpplysninger,
                  svar: [...sendSykmeldingValues.uriktigeOpplysninger],
              }
            : undefined,
        arbeidssituasjon: sendSykmeldingValues.arbeidssituasjon
            ? {
                  sporsmaltekst: sporsmal.arbeidssituasjon,
                  svar: sendSykmeldingValues.arbeidssituasjon,
              }
            : raise('Arbeidssitusajon er påkrevd'),
        arbeidsgiverOrgnummer: sendSykmeldingValues.arbeidsgiverOrgnummer
            ? {
                  sporsmaltekst: sporsmal.arbeidsgiverOrgnummer,
                  svar: sendSykmeldingValues.arbeidsgiverOrgnummer,
              }
            : undefined,
        riktigNarmesteLeder: sendSykmeldingValues.riktigNarmesteLeder
            ? {
                  sporsmaltekst: sporsmal.riktigNarmesteLeder(metadata.narmestelederNavn ?? ``),
                  svar: yesOrNoToJaEllerNei(sendSykmeldingValues.riktigNarmesteLeder),
              }
            : undefined,
        harBruktEgenmeldingsdager: sendSykmeldingValues.harEgenmeldingsdager
            ? {
                  sporsmaltekst: sporsmal.harBruktEgenmeldingsdager(metadata.arbeidsgiverNavn ?? ``),
                  svar: yesOrNoToJaEllerNei(sendSykmeldingValues.harEgenmeldingsdager),
              }
            : undefined,
        egenmeldingsdager: sendSykmeldingValues.egenmeldingsdager
            ? {
                  sporsmaltekst: sporsmal.egenmeldingsdager,
                  svar: [...sendSykmeldingValues.egenmeldingsdager],
              }
            : undefined,
        fisker:
            sendSykmeldingValues.fisker != null
                ? {
                      blad: {
                          sporsmaltekst: sporsmal.fisker.velgBlad,
                          svar: sendSykmeldingValues.fisker.blad ?? raise('Blad må være satt'),
                      },
                      lottOgHyre: {
                          sporsmaltekst: sporsmal.fisker.lottEllerHyre,
                          svar: sendSykmeldingValues.fisker.lottOgHyre ?? raise('Lott og hyre må være satt'),
                      },
                  }
                : undefined,
        arbeidsledig:
            sendSykmeldingValues.arbeidsledig?.arbeidsledigFraOrgnummer != null
                ? {
                      arbeidsledigFraOrgnummer: {
                          sporsmaltekst: sporsmal.arbeidsledigFra(ArbeidssituasjonType.ARBEIDSLEDIG),
                          svar:
                              sendSykmeldingValues.arbeidsledig.arbeidsledigFraOrgnummer ??
                              raise('Orgnummer må være satt'),
                      },
                  }
                : undefined,
    }
}

export function mapFrilanserFormValuesToBrukerSvar(
    formValues: FormValues,
    oppfolgingsdato: string,
): Pick<BrukerSvar, 'egenmeldingsperioder' | 'harBruktEgenmelding' | 'harForsikring'> {
    const sendSykmeldingValues = mapToSendSykmeldingValues(formValues)

    return {
        harForsikring:
            sendSykmeldingValues.harForsikring != null
                ? {
                      sporsmaltekst: sporsmal.harForsikring,
                      svar: yesOrNoToJaEllerNei(sendSykmeldingValues.harForsikring),
                  }
                : undefined,
        harBruktEgenmelding: sendSykmeldingValues.harBruktEgenmelding
            ? {
                  sporsmaltekst: sporsmal.harBruktEgenmelding(oppfolgingsdato),
                  svar: yesOrNoToJaEllerNei(sendSykmeldingValues.harBruktEgenmelding),
              }
            : undefined,
        egenmeldingsperioder: sendSykmeldingValues.egenmeldingsperioder
            ? {
                  sporsmaltekst: sporsmal.egenmeldingsperioder(oppfolgingsdato),
                  svar: sendSykmeldingValues.egenmeldingsperioder.map((it) => ({
                      fom: it.fom ?? raise('Fom må være satt'),
                      tom: it.tom ?? raise('Tom må være satt'),
                  })),
              }
            : undefined,
    }
}
