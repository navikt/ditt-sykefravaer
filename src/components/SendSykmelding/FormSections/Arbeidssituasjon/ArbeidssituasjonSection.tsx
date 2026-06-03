import React, { ReactElement, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Accordion, Alert, BodyLong, BodyShort, Heading, Link as DsLink } from '@navikt/ds-react'

import { Periodetype, Sykmelding } from '../../../../types/sykmelding/sykmelding'
import { arbeidssituasjonDependentFields, useShouldArbeidssituasjonShow } from '../shared/sykmeldingUtils'
import { getSykmeldingStartDate } from '../../../../utils/sykmeldingUtils'
import { SectionWrapper } from '../../../FormComponents/FormStructure'
import { isArbeidsledig, isFrilanserOrNaeringsdrivendeOrJordbruker } from '../../../../utils/arbeidssituasjonUtils'
import { FormValues } from '../../SendSykmeldingForm'
import Spinner from '../../../Spinner/Spinner'
import useTidligereArbeidsgivereById from '../../../../hooks/sykmelding/useTidligereArbeidsgivereById'
import { Brukerinformasjon } from '../../../../types/sykmelding/brukerinformasjon'

import { ArbeidssituasjonInfo } from './ArbeidssituasjonInfo'
import ArbeidssituasjonField from './ArbeidssituasjonField'
import FrilanserSection from './Frilanser/FrilanserSection'
import { useArbeidssituasjonSubSections } from './formProgressUtils'
import FiskerSection from './Fisker/FiskerSection'
import ArbeidsledigArbeidsgiverField from './Arbeidsledig/ArbeidsledigArbeidsgiverField'
import AnsattArbeidstakerSection from './Arbeidsgiver/AnsattArbeidstakerSection'

interface Props {
    sykmelding: Sykmelding
    brukerinformasjon: Brukerinformasjon
}

function ArbeidssituasjonSection({ sykmelding, brukerinformasjon }: Props): ReactElement | null {
    const { watch, reset, getValues } = useFormContext<FormValues>()
    const arbeidssituasjon = watch('arbeidssituasjon')

    useEffect(() => {
        reset({ ...getValues(), ...arbeidssituasjonDependentFields })
    }, [arbeidssituasjon, reset, getValues])

    const { data, isPending: loading, error } = useTidligereArbeidsgivereById(sykmelding.id)

    const { shouldShowArbeidsgiverOrgnummer, shouldShowFisker } = useArbeidssituasjonSubSections()
    const harAvventendePeriode = sykmelding.sykmeldingsperioder.some((it) => it.type === Periodetype.AVVENTENDE)

    // Don't show arbeidssituasjon section given certain criteria
    if (!useShouldArbeidssituasjonShow()) return null
    return (
        <SectionWrapper title="Hvilken arbeidssituasjon gjelder sykmeldingen for?">
            <ArbeidssituasjonInfo />
            <ArbeidssituasjonField harAvventendePeriode={harAvventendePeriode} />
            <Accordion className="mt-4">
                <Accordion.Item>
                    <Accordion.Header>Finner du ikke riktig situasjon?</Accordion.Header>
                    <Accordion.Content>
                        {/* TODO: Innhold ikke spesifisert i Figma-design */}
                        <BodyShort>Innhold kommer.</BodyShort>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>Har du flere jobber?</Accordion.Header>
                    <Accordion.Content>
                        <BodyLong spacing>
                            Du trenger én sykmelding per jobb eller arbeidssituasjon du har.
                        </BodyLong>
                        <BodyLong>
                            Denne sykmeldingen gjelder bare for én jobb. Be legen om egne sykmeldinger for hver
                            arbeidssituasjon du er sykmeldt fra.
                        </BodyLong>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>Hva er forskjellen på frilanser og selvstendig næringsdrivende?</Accordion.Header>
                    <Accordion.Content>
                        <BodyLong spacing>
                            <strong>Frilanser:</strong> Du tar oppdrag og fakturerer, men har ikke registrert eget
                            foretak. Du har ikke ENK eller AS.
                        </BodyLong>
                        <BodyLong spacing>
                            <strong>Selvstendig næringsdrivende</strong>: Du har registrert enkeltpersonsforetak (ENK),
                            ansvarlig selskap (ANS) eller selskap med delt ansvar (DA)
                        </BodyLong>
                        <BodyLong>
                            <strong>Driver du AS?</strong> Da er du som oftest ansatt i ditt eget selskap og skal velge
                            ansatt — ikke selvstendig næringsdrivende.
                        </BodyLong>
                    </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                    <Accordion.Header>Går du på arbeidsavklaringspenger (AAP) eller uføretrygd?</Accordion.Header>
                    <Accordion.Content>
                        <BodyLong spacing>
                            <strong>Arbeidsavklaringspenger (AAP)</strong>
                            <br />
                            Mottar du AAP, fortsetter ytelsen som normalt. Du trenger normalt ikke sykepenger i tillegg,
                            og kan avbryte denne sykmeldingen uten at det påvirker AAP. Ønsker du fortsatt å søke om
                            sykepenger, velger du den arbeidssituasjonen som gjelder for deg.
                        </BodyLong>
                        <BodyLong spacing>
                            Går du på arbeidsavklaringspenger og <strong>jobber ved siden av</strong>? Da kan du ha rett
                            til sykepenger av arbeidsinntekten. Velg i så fall den situasjonen som passer best for
                            jobben du har ved siden av.
                        </BodyLong>
                        <BodyLong spacing>
                            <strong>Uføretrygd</strong>
                            <br />
                            Har du <strong>full uføretrygd</strong> har du i utgangspunktet ikke rett til sykepenger fra
                            Nav. Uføretrygden din fortsetter uansett, og du kan avbryte denne sykmeldingen uten at det
                            påvirker uføretrygden.
                        </BodyLong>
                        <BodyLong spacing>
                            Ønsker du fortsatt å søke om sykepenger, bekrefter du bare denne sykmeldingen og fyller ut
                            søknaden om sykepenger som vanlig.
                        </BodyLong>
                        <BodyLong>
                            Har du uføretrygd og <strong>jobber ved siden av</strong>? Da kan du ha rett til sykepenger
                            av arbeidsinntekten. Velg i så fall den situasjonen som passer best for jobben du har ved
                            siden av.
                        </BodyLong>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
            {shouldShowArbeidsgiverOrgnummer && (
                <AnsattArbeidstakerSection sykmelding={sykmelding} arbeidsgivere={brukerinformasjon.arbeidsgivere} />
            )}
            {shouldShowFisker && <FiskerSection sykmelding={sykmelding} brukerinformasjon={brukerinformasjon} />}
            {isFrilanserOrNaeringsdrivendeOrJordbruker(arbeidssituasjon) && (
                <FrilanserSection
                    sykmeldingId={sykmelding.id}
                    sykmeldingStartDato={getSykmeldingStartDate(sykmelding.sykmeldingsperioder)}
                    arbeidssituasjon={arbeidssituasjon!}
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
