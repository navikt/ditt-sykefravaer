import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
    AnnenFraverGrunn,
    ArbeidsrelatertArsakType,
    ArbeidssituasjonType,
    Blad,
    JaEllerNei,
    LottOgHyre,
    MedisinskArsakType,
    Merknadtype,
    Periodetype,
    RegelStatus,
    ShortName,
    StatusEvent,
    Svartype,
    SykmeldingChangeStatus,
    UriktigeOpplysningerType,
    YesOrNo,
} from '../fetching/graphql.generated'
import { fetchJsonMedRequestId } from '../utils/fetch'

export type ChangeSykmeldingStatusMutation = {
    readonly __typename: 'Mutation'
    readonly changeSykmeldingStatus: {
        readonly __typename: 'Sykmelding'
        readonly id: string
        readonly mottattTidspunkt: string
        readonly utdypendeOpplysninger: unknown
        readonly tiltakArbeidsplassen?: string | null
        readonly tiltakNAV?: string | null
        readonly andreTiltak?: string | null
        readonly meldingTilArbeidsgiver?: string | null
        readonly behandletTidspunkt: string
        readonly egenmeldt?: boolean | null
        readonly papirsykmelding?: boolean | null
        readonly rulesetVersion: number
        readonly behandlingsutfall: {
            readonly __typename: 'Behandlingsutfall'
            readonly status: RegelStatus
            readonly ruleHits: ReadonlyArray<{
                readonly __typename: 'RegelInfo'
                readonly messageForSender: string
                readonly messageForUser: string
                readonly ruleName: string
                readonly ruleStatus: RegelStatus
            }>
        }
        readonly arbeidsgiver?: { readonly __typename: 'ArbeidsgiverSykmelding'; readonly navn?: string | null } | null
        readonly sykmeldingsperioder: ReadonlyArray<{
            readonly __typename: 'Periode'
            readonly fom: string
            readonly tom: string
            readonly behandlingsdager?: number | null
            readonly innspillTilArbeidsgiver?: string | null
            readonly type: Periodetype
            readonly reisetilskudd: boolean
            readonly gradert?: {
                readonly __typename: 'GradertPeriode'
                readonly grad: number
                readonly reisetilskudd: boolean
            } | null
            readonly aktivitetIkkeMulig?: {
                readonly __typename: 'AktivitetIkkeMuligPeriode'
                readonly medisinskArsak?: {
                    readonly __typename: 'MedisinskArsak'
                    readonly beskrivelse?: string | null
                    readonly arsak: ReadonlyArray<MedisinskArsakType>
                } | null
                readonly arbeidsrelatertArsak?: {
                    readonly __typename: 'ArbeidsrelatertArsak'
                    readonly beskrivelse?: string | null
                    readonly arsak: ReadonlyArray<ArbeidsrelatertArsakType>
                } | null
            } | null
        }>
        readonly sykmeldingStatus: {
            readonly __typename: 'SykmeldingStatus'
            readonly statusEvent: StatusEvent
            readonly timestamp: string
            readonly arbeidsgiver?: {
                readonly __typename: 'ArbeidsgiverStatus'
                readonly orgnummer: string
                readonly orgNavn: string
            } | null
            readonly sporsmalOgSvarListe: ReadonlyArray<{
                readonly __typename: 'Sporsmal'
                readonly tekst: string
                readonly shortName: ShortName
                readonly svar:
                    | {
                          readonly __typename: 'ArbeidssituasjonSvar'
                          readonly svarType: Svartype
                          readonly arbeidsituasjon: ArbeidssituasjonType
                      }
                    | {
                          readonly __typename: 'DagerSvar'
                          readonly svarType: Svartype
                          readonly dager: ReadonlyArray<string>
                      }
                    | { readonly __typename: 'JaNeiSvar'; readonly svarType: Svartype; readonly jaNei: YesOrNo }
                    | {
                          readonly __typename: 'PerioderSvar'
                          readonly svarType: Svartype
                          readonly perioder: ReadonlyArray<{
                              readonly __typename: 'FomTom'
                              readonly fom: string
                              readonly tom: string
                          }>
                      }
            }>
            readonly brukerSvar?: {
                readonly __typename: 'BrukerSvar'
                readonly erOpplysningeneRiktige: {
                    readonly __typename: 'ErOpplysningeneRiktigeBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                }
                readonly uriktigeOpplysninger?: {
                    readonly __typename: 'UriktigeOpplysningerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<UriktigeOpplysningerType>
                } | null
                readonly arbeidssituasjon: {
                    readonly __typename: 'ArbeidssituasjonBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ArbeidssituasjonType
                }
                readonly arbeidsgiverOrgnummer?: {
                    readonly __typename: 'ArbeidsgiverOrgnummerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: string
                } | null
                readonly riktigNarmesteLeder?: {
                    readonly __typename: 'RiktigNarmesteLederBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly harBruktEgenmeldingsdager?: {
                    readonly __typename: 'HarBruktEgenmeldingsdagerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly egenmeldingsdager?: {
                    readonly __typename: 'EgenmeldingsdagerBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<string>
                } | null
                readonly harBruktEgenmelding?: {
                    readonly __typename: 'HarFrilanserEllerSelvstendigBruktEgenmeldingBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly egenmeldingsperioder?: {
                    readonly __typename: 'FrilanserEllerSelvstendigEgenmeldingsperioderBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: ReadonlyArray<{
                        readonly __typename: 'FomTom'
                        readonly fom: string
                        readonly tom: string
                    }>
                } | null
                readonly harForsikring?: {
                    readonly __typename: 'HarForsikringBrukerSvar'
                    readonly sporsmaltekst: string
                    readonly svar: JaEllerNei
                } | null
                readonly fisker?: {
                    readonly __typename: 'FiskerBrukerSvar'
                    readonly blad: {
                        readonly __typename: 'BladBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: Blad
                    }
                    readonly lottOgHyre: {
                        readonly __typename: 'LottOgHyreBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: LottOgHyre
                    }
                } | null
                readonly arbeidsledig?: {
                    readonly __typename: 'ArbeidsledigBrukerSvar'
                    readonly arbeidsledigFraOrgnummer?: {
                        readonly __typename: 'ArbeidsledigFraOrgnummerBrukerSvar'
                        readonly sporsmaltekst: string
                        readonly svar: string
                    } | null
                } | null
            } | null
        }
        readonly medisinskVurdering?: {
            readonly __typename: 'MedisinskVurdering'
            readonly svangerskap: boolean
            readonly yrkesskade: boolean
            readonly yrkesskadeDato?: string | null
            readonly hovedDiagnose?: {
                readonly __typename: 'Diagnose'
                readonly tekst?: string | null
                readonly kode: string
                readonly system: string
            } | null
            readonly biDiagnoser: ReadonlyArray<{
                readonly __typename: 'Diagnose'
                readonly tekst?: string | null
                readonly kode: string
                readonly system: string
            }>
            readonly annenFraversArsak?: {
                readonly __typename: 'AnnenFraversArsak'
                readonly grunn: ReadonlyArray<AnnenFraverGrunn>
                readonly beskrivelse?: string | null
            } | null
        } | null
        readonly prognose?: {
            readonly __typename: 'Prognose'
            readonly arbeidsforEtterPeriode: boolean
            readonly hensynArbeidsplassen?: string | null
            readonly erIArbeid?: {
                readonly __typename: 'ErIArbeid'
                readonly egetArbeidPaSikt: boolean
                readonly annetArbeidPaSikt: boolean
                readonly arbeidFOM?: string | null
                readonly vurderingsdato?: string | null
            } | null
            readonly erIkkeIArbeid?: {
                readonly __typename: 'ErIkkeIArbeid'
                readonly arbeidsforPaSikt: boolean
                readonly arbeidsforFOM?: string | null
                readonly vurderingsdato?: string | null
            } | null
        } | null
        readonly meldingTilNAV?: {
            readonly __typename: 'MeldingTilNAV'
            readonly beskrivBistand?: string | null
            readonly bistandUmiddelbart: boolean
        } | null
        readonly kontaktMedPasient: {
            readonly __typename: 'KontaktMedPasient'
            readonly begrunnelseIkkeKontakt?: string | null
            readonly kontaktDato?: string | null
        }
        readonly behandler: {
            readonly __typename: 'Behandler'
            readonly fornavn: string
            readonly mellomnavn?: string | null
            readonly etternavn: string
            readonly tlf?: string | null
            readonly adresse?: {
                readonly __typename: 'Adresse'
                readonly gate?: string | null
                readonly postnummer?: number | null
                readonly kommune?: string | null
                readonly postboks?: string | null
                readonly land?: string | null
            } | null
        }
        readonly merknader?: ReadonlyArray<{
            readonly __typename: 'Merknad'
            readonly beskrivelse?: string | null
            readonly type: Merknadtype
        }> | null
        readonly pasient?: {
            readonly __typename: 'Pasient'
            readonly fnr?: string | null
            readonly fornavn?: string | null
            readonly mellomnavn?: string | null
            readonly etternavn?: string | null
            readonly overSyttiAar?: boolean | null
        } | null
        readonly utenlandskSykmelding?: { readonly __typename: 'UtenlandskSykmelding'; readonly land: string } | null
    }
}

export function useChangeSykmeldingStatus(
    sykmeldingId: string,
    status: SykmeldingChangeStatus,
    onCompleted: () => void,
    onError: () => void,
) {
    const dedupeRef = useRef(false)
    const queryClient = useQueryClient()

    return useMutation<ChangeSykmeldingStatusMutation, unknown, void>({
        mutationFn: async () => {
            return fetchJsonMedRequestId(
                '/syk/sykefravaer/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/' + sykmeldingId + '/change-status',
                {
                    method: 'POST',
                    body: JSON.stringify(status),
                    headers: { 'Content-Type': 'application/json' },
                },
            )
        },

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['sykmeldinger-flex', sykmeldingId],
            })
            queryClient
                .invalidateQueries({
                    queryKey: ['sykmeldinger-flex'],
                })
                .catch()

            dedupeRef.current = false
            onCompleted()
            window.scrollTo(0, 0)
        },
        onError: () => {
            dedupeRef.current = false
            onError()
        },
    })
}
