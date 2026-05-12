import { useFormContext } from 'react-hook-form'

import { YesOrNo } from '../../../../types/sykmelding/sykmeldingCommon'
import { UriktigeOpplysningerType } from '../../../../types/sykmelding/sykmeldingBrukerSvar'
import { FormValues } from '../../SendSykmeldingForm'

export const arbeidssituasjonDependentFields: Partial<FormValues> = {
    arbeidsgiverOrgnummer: null,
    riktigNarmesteLeder: null,
    erSykmeldtFraFlereArbeidsforhold: null,
    egenmeldingsdager: null,
    sykFoerSykmeldingen: null,
    harBruktEgenmelding: null,
    egenmeldingsperioder: [{ fom: null, tom: null }],
    harForsikring: null,
    fisker: { blad: null, lottOgHyre: null },
    arbeidsledig: { arbeidsledigFraOrgnummer: null },
}

export function useShouldArbeidssituasjonShow(): boolean {
    const { watch } = useFormContext<FormValues>()
    const [erOpplysningeneRiktige, uriktigeOpplysninger] = watch(['erOpplysningeneRiktige', 'uriktigeOpplysninger'])

    // Don't show section when user hasn't yet answered question
    if (erOpplysningeneRiktige == null) return false

    // "Yes" should always show the section
    if (erOpplysningeneRiktige === YesOrNo.YES) return true

    // "No" but no uriktigeOpplysninger should not show the section
    if (uriktigeOpplysninger == null || uriktigeOpplysninger.length === 0) return false

    // "No" should show the section if uriktigeOpplysninger is not Periode og SykmeldingsgradForLav
    return !getTrengerNySykmelding(uriktigeOpplysninger)
}

export function getTrengerNySykmelding(uriktigeOpplysninger: UriktigeOpplysningerType[] | null): boolean {
    if (uriktigeOpplysninger == null) return false

    return (
        uriktigeOpplysninger?.includes(UriktigeOpplysningerType.PERIODE) ||
        uriktigeOpplysninger?.includes(UriktigeOpplysningerType.SYKMELDINGSGRAD_FOR_LAV)
    )
}
