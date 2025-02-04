import {
    Brukerinformasjon,
    BrukerinformasjonDocument,
    BrukerinformasjonQuery,
    SykmeldingErUtenforVentetidDocument,
    SykmeldingErUtenforVentetidQuery,
    TidligereArbeidsgivereByIdDocument,
    UtenforVentetid,
} from '../../fetching/graphql.generated'

import { createMock } from './dataUtils'

export function brukerinformasjonData(brukerinformasjon: Partial<Brukerinformasjon> = {}): BrukerinformasjonQuery {
    return {
        __typename: 'Query',
        brukerinformasjon: {
            __typename: 'Brukerinformasjon',
            arbeidsgivere: [],
            ...brukerinformasjon,
        },
    }
}

export function erUtenforVentetidData(
    utenforVentetid: Partial<UtenforVentetid> = {},
): SykmeldingErUtenforVentetidQuery {
    return {
        __typename: 'Query',
        sykmeldingUtenforVentetid: {
            __typename: 'UtenforVentetid',
            erUtenforVentetid: true,
            oppfolgingsdato: null,
            ...utenforVentetid,
        },
    }
}

export function createExtraFormDataMock({
    sykmeldingId = 'sykmelding-id',
    utenforVentetid = {},
    brukerinformasjon = {},
}: {
    sykmeldingId?: string
    utenforVentetid?: Partial<UtenforVentetid>
    brukerinformasjon?: Partial<Brukerinformasjon>
} = {}) {
    return [
        createMock({
            request: { query: BrukerinformasjonDocument },
            result: {
                data: brukerinformasjonData(brukerinformasjon),
            },
        }),
        createMock({
            request: { query: SykmeldingErUtenforVentetidDocument, variables: { sykmeldingId } },
            result: {
                data: erUtenforVentetidData(utenforVentetid),
            },
        }),
        createMock({
            request: { query: TidligereArbeidsgivereByIdDocument, variables: { sykmeldingId } },
            result: {
                data: {
                    __typename: 'Query',
                    tidligereArbeidsgivere: [],
                },
            },
        }),
    ]
}
