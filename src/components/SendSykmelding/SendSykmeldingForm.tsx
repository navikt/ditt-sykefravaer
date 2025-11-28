import { ReactElement, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Alert } from '@navikt/ds-react'
import dynamic from 'next/dynamic'

import { Sykmelding } from '../../types/sykmelding/sykmelding'
import { ArbeidssituasjonType, Blad, LottOgHyre, YesOrNo } from '../../types/sykmelding/sykmeldingCommon'
import { UriktigeOpplysningerType } from '../../types/sykmelding/sykmeldingBrukerSvar'
import useGetSykmeldingIdParam from '../../hooks/useGetSykmeldingIdParam'
import { useSendSykmelding } from '../../hooks/sykmelding/useSendSykmelding'
import Spinner from '../Spinner/Spinner'
import { EgenmeldingsdagerSubForm } from '../FormComponents/Egenmelding/EgenmeldingerField'
import useWarnUnsavedPopup from '../../hooks/useWarnUnsaved'
import useBrukerinformasjonById from '../../hooks/sykmelding/useBrukerinformasjonById'
import AutoFillerDevTools from '../FormComponents/DevTools/AutoFillerDevTools'
import { logUmamiEvent, useLogUmamiEvent } from '../umami/umami'
import { autofillEnabled } from '../../utils/environment'

import OpplysningerRiktigeSection from './FormSections/OpplysningerRiktige/OpplysningerRiktigeSection'
import ActionSection from './FormSections/ActionSection'
import ArbeidssituasjonSection from './FormSections/Arbeidssituasjon/ArbeidssituasjonSection'
import ErrorSection from './FormSections/ErrorSection'

const FormDevTools = dynamic(() => import('../FormComponents/DevTools/FormDevTools'), {
    ssr: false,
})

export interface FormValues extends EgenmeldingsdagerSubForm {
    erOpplysningeneRiktige: YesOrNo | null
    uriktigeOpplysninger: UriktigeOpplysningerType[] | null
    arbeidssituasjon: ArbeidssituasjonType | null
    arbeidsgiverOrgnummer: string | null
    riktigNarmesteLeder: YesOrNo | null
    harBruktEgenmelding: YesOrNo | null
    egenmeldingsperioder: { fom: Date | null; tom: Date | null }[] | null
    harForsikring: YesOrNo | null
    fisker: FiskerFormValues
    extra: {
        annetSituasjon: string | null
    } | null
    arbeidsledig: {
        arbeidsledigFraOrgnummer: string | null
    } | null
    erSykmeldtFraFlereArbeidsforhold: YesOrNo | null
}

export interface FiskerFormValues {
    blad: Blad | null
    lottOgHyre: LottOgHyre | null
}

interface Props {
    sykmelding: Sykmelding
    onSykmeldingAvbrutt: () => void
}

function SendSykmeldingForm({ sykmelding, onSykmeldingAvbrutt }: Props): ReactElement {
    const skjemanavn = !sykmelding.papirsykmelding ? 'åpen sykmelding' : 'åpen papirsykmelding'
    const sykmeldingId = useGetSykmeldingIdParam()

    useLogUmamiEvent({ eventName: 'skjema åpnet', data: { skjemanavn } })

    const errorSectionRef = useRef<HTMLDivElement>(null)
    const form = useForm<FormValues>({
        shouldFocusError: false,
        defaultValues: {
            erOpplysningeneRiktige: null,
            uriktigeOpplysninger: null,
            arbeidssituasjon: null,
            arbeidsgiverOrgnummer: null,
            riktigNarmesteLeder: null,
            harBruktEgenmelding: null,
            // useFieldArray doesn't allow default values when mounted
            egenmeldingsperioder: [{ fom: null, tom: null }],
            harForsikring: null,
            egenmeldingsdager: null,
            fisker: {
                blad: null,
                lottOgHyre: null,
            },
            arbeidsledig: {
                arbeidsledigFraOrgnummer: null,
            },
            erSykmeldtFraFlereArbeidsforhold: null,
        },
    })
    const brukerinformasjonData = useBrukerinformasjonById(sykmeldingId)
    const sendSmMut = useSendSykmelding(
        sykmeldingId,
        (values) => {
            logUmamiEvent(
                { eventName: 'skjema fullført', data: { skjemanavn } },
                { 'antall egenmeldingsdager': values.egenmeldingsdager?.length ?? null },
            )

            const annetSituationExtraValue: string | null = values.extra?.annetSituasjon ?? null

            if (annetSituationExtraValue) {
                logUmamiEvent({
                    eventName: 'skjema spørsmål besvart',
                    data: {
                        skjemanavn: 'åpen sykmelding',
                        spørsmål: 'Hvilken situasjon er du i som gjorde at du valgte annet?',
                        svar: annetSituationExtraValue,
                    },
                })
            }
        },
        () => logUmamiEvent({ eventName: 'skjema innsending feilet', data: { skjemanavn } }),
    )

    useWarnUnsavedPopup(form.formState.isDirty && !form.formState.isSubmitSuccessful)

    if (brukerinformasjonData.isLoading) {
        return <Spinner headline="Henter arbeidsforhold" />
    }

    if (brukerinformasjonData.error || !brukerinformasjonData.data) {
        return (
            <Alert variant="error" role="alert" aria-live="polite">
                Vi klarte dessverre ikke å hente informasjonen som trengs for at du kan bruke sykmeldingen. Vennligst
                prøv igjen senere.
            </Alert>
        )
    }

    return (
        <FormProvider {...form}>
            {autofillEnabled() && <AutoFillerDevTools sykmeldingId={sykmeldingId} />}
            <form
                onSubmit={form.handleSubmit(
                    () => {
                        sendSmMut.mutate(form.getValues())
                    },
                    () => {
                        requestAnimationFrame(() => {
                            errorSectionRef.current?.focus()
                        })
                    },
                )}
            >
                <OpplysningerRiktigeSection />
                <ArbeidssituasjonSection sykmelding={sykmelding} brukerinformasjon={brukerinformasjonData.data} />
                <ErrorSection ref={errorSectionRef} />
                <ActionSection
                    sykmeldingId={sykmeldingId}
                    sendResult={sendSmMut}
                    onSykmeldingAvbrutt={onSykmeldingAvbrutt}
                />
                {process.env.NODE_ENV !== 'production' && <FormDevTools />}
            </form>
        </FormProvider>
    )
}

export default SendSykmeldingForm
