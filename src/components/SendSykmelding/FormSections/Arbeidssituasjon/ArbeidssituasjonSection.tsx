import React, { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'
import { Alert, BodyShort, Heading, Link as DsLink } from '@navikt/ds-react'

import { BrukerinformasjonFragment } from '../../../../fetching/graphql.generated'
import { Periodetype, Sykmelding } from '../../../../types/sykmelding'
import { useShouldArbeidssituasjonShow } from '../shared/sykmeldingUtils'
import { getSykmeldingStartDate } from '../../../../utils/sykmeldingUtils'
import { SectionWrapper } from '../../../FormComponents/FormStructure'
import { isArbeidsledig, isFrilanserOrNaeringsdrivendeOrJordbruker } from '../../../../utils/arbeidssituasjonUtils'
import { FormValues } from '../../SendSykmeldingForm'
import Spinner from '../../../Spinner/Spinner'
import useTidligereArbeidsgivereById from '../../../../hooks/useTidligereArbeidsgivereById'

import { ArbeidssituasjonInfo } from './ArbeidssituasjonInfo'
import ArbeidssituasjonField from './ArbeidssituasjonField'
import FrilanserSection from './Frilanser/FrilanserSection'
import { useArbeidssituasjonSubSections } from './formProgressUtils'
import FiskerSection from './Fisker/FiskerSection'
import ArbeidsledigArbeidsgiverField from './Arbeidsledig/ArbeidsledigArbeidsgiverField'
import AnsattArbeidstakerSection from './Arbeidsgiver/AnsattArbeidstakerSection'

interface Props {
    sykmelding: Sykmelding
    brukerinformasjon: BrukerinformasjonFragment
}

function ArbeidssituasjonSection({ sykmelding, brukerinformasjon }: Props): ReactElement | null {
    const { watch } = useFormContext<FormValues>()
    const arbeidssituasjon = watch('arbeidssituasjon')

    const { data, isPending: loading, error } = useTidligereArbeidsgivereById(sykmelding.id)

    const { shouldShowArbeidsgiverOrgnummer, shouldShowFisker } = useArbeidssituasjonSubSections()
    const harAvventendePeriode = sykmelding.sykmeldingsperioder.some((it) => it.type === Periodetype.AVVENTENDE)

    // Don't show arbeidssituasjon section given certain criteria
    if (!useShouldArbeidssituasjonShow()) return null
    return (
        <SectionWrapper title="Hvilken arbeidssituasjon gjelder sykmeldingen for?">
            <ArbeidssituasjonInfo />
            <ArbeidssituasjonField harAvventendePeriode={harAvventendePeriode} />
            {shouldShowArbeidsgiverOrgnummer && (
                <AnsattArbeidstakerSection sykmelding={sykmelding} arbeidsgivere={brukerinformasjon.arbeidsgivere} />
            )}
            {shouldShowFisker && <FiskerSection sykmelding={sykmelding} brukerinformasjon={brukerinformasjon} />}
            {isFrilanserOrNaeringsdrivendeOrJordbruker(arbeidssituasjon) && (
                <FrilanserSection
                    sykmeldingId={sykmelding.id}
                    sykmeldingStartDato={getSykmeldingStartDate(sykmelding.sykmeldingsperioder)}
                />
            )}
            {isArbeidsledig(arbeidssituasjon) &&
                (loading ? (
                    <Spinner headline="Laster arbeidsgivere" />
                ) : error ? (
                    <Alert className="mt-6" variant="error" role="alert">
                        <Heading spacing size="small" level="3">
                            Det skjedde en feil ved lasting av arbeidsgivere.
                        </Heading>
                        <BodyShort spacing>
                            Dersom problemet vedvarer, kan du fortelle oss om feilen på{' '}
                            <DsLink
                                href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler"
                                target="_blank"
                            >
                                skjemaet for feil og mangler
                            </DsLink>
                        </BodyShort>
                    </Alert>
                ) : data && data.length > 0 ? (
                    <ArbeidsledigArbeidsgiverField arbeidsgivere={data} />
                ) : null)}
        </SectionWrapper>
    )
}

export default ArbeidssituasjonSection
