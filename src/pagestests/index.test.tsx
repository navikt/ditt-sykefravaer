import { describe, it, expect, beforeEach } from 'vitest'
import mockRouter from 'next-router-mock'

import {
    BrukerinformasjonDocument,
    SykmeldingByIdDocument,
    SykmeldingerDocument,
    TidligereArbeidsgivereByIdDocument,
} from '../fetching/graphql.generated'
import { render, screen } from '../utils/test/testUtils'
import { createInitialQuery, createMock, createSykmelding } from '../utils/test/dataUtils'
import SykmeldingPage from '../pages/sykmelding/[sykmeldingId]/index'
import { brukerinformasjonData, createExtraFormDataMock } from '../utils/test/mockUtils'
import { dateSub } from '../utils/dateUtils'

describe.skip('SykmeldingPage: /syk/sykmeldinger/{sykmeldingId}', () => {
    beforeEach(() => {
        mockRouter.setCurrentUrl(`/sykmelding-id`)
    })

    it('should display sykmelding and form when all requests are successful', async () => {
        const sykmelding = createSykmelding({ id: 'sykmelding-id' })

        render(<SykmeldingPage />, {
            mocks: [
                createMock({
                    request: { query: SykmeldingByIdDocument, variables: { id: 'sykmelding-id' } },
                    result: { data: { __typename: 'Query', sykmelding: sykmelding } },
                }),
                createMock({
                    request: { query: SykmeldingerDocument },
                    result: { data: { __typename: 'Query', sykmeldinger: [sykmelding] } },
                }),
                createMock({
                    request: { query: BrukerinformasjonDocument, variables: { sykmeldingId: 'sykmelding-id' } },
                    result: {
                        data: brukerinformasjonData({
                            arbeidsgivere: [
                                {
                                    __typename: 'Arbeidsgiver',
                                    aktivtArbeidsforhold: true,
                                    navn: 'Arbeidsgiver AS',
                                    orgnummer: '123456789',
                                    naermesteLeder: null,
                                },
                            ],
                        }),
                        extensions: { dontLog: true },
                    },
                }),
                ...createExtraFormDataMock(),
            ],
        })

        expect(await screen.findByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeInTheDocument()
        expect(await screen.findByRole('button', { name: /^(Send|Bekreft) sykmelding/ })).toBeInTheDocument()
        expect(
            screen.queryByRole('heading', { name: /du må velge om du skal bruke, før du kan bruke denne/ }),
        ).not.toBeInTheDocument()
    })

    it('should display force user to send inn unsent sykmelding if there is an older one', async () => {
        const thisSykmelding = createSykmelding({
            mottattTidspunkt: dateSub(new Date(), { days: 2 }),
            id: 'this-sykmelding',
        })
        const previousSykmelding = createSykmelding({
            mottattTidspunkt: dateSub(new Date(), { days: 30 }),
            id: 'previous-sykmelding',
        })

        mockRouter.setCurrentUrl(`/${thisSykmelding.id}`)

        render(<SykmeldingPage />, {
            mocks: [
                createMock({
                    request: { query: SykmeldingByIdDocument, variables: { id: 'this-sykmelding' } },
                    result: { data: { __typename: 'Query', sykmelding: thisSykmelding } },
                }),
                createMock({
                    request: { query: SykmeldingerDocument },
                    result: { data: { __typename: 'Query', sykmeldinger: [thisSykmelding, previousSykmelding] } },
                }),
            ],
            initialState: [
                createInitialQuery(BrukerinformasjonDocument, brukerinformasjonData(), {
                    sykmeldingId: 'this-sykmelding',
                }),
                createInitialQuery(
                    TidligereArbeidsgivereByIdDocument,
                    { __typename: 'Query', tidligereArbeidsgivere: [] },
                    { sykmeldingId: 'this-sykmelding' },
                ),
            ],
        })

        expect(
            await screen.findByText(`Du har 1 sykmelding du må velge om du skal bruke, før du kan bruke denne.`),
        ).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Bekreft sykmelding' })).not.toBeInTheDocument()
    })

    it('should fail with error message when sykmelding cant be fetched', async () => {
        render(<SykmeldingPage />, {
            mocks: [
                createMock({
                    request: { query: SykmeldingByIdDocument, variables: { id: 'sykmelding-id' } },
                    result: {
                        data: null,
                        errors: [new Error('Some backend error')],
                        extensions: { dontLog: true },
                    },
                }),
                createMock({
                    request: { query: SykmeldingerDocument },
                    result: {
                        data: null,
                        errors: [new Error('Some backend error')],
                        extensions: { dontLog: true },
                    },
                }),
                ...createExtraFormDataMock(),
            ],
        })

        expect(await screen.findByText(/Det har oppstått en feil/))
    })

    it('should show sykmelding, but not form, when brukerinformasjon cant be fetched', async () => {
        const sykmelding = createSykmelding({ id: 'sykmelding-id' })

        render(<SykmeldingPage />, {
            mocks: [
                createMock({
                    request: { query: SykmeldingByIdDocument, variables: { id: 'sykmelding-id' } },
                    result: { data: { __typename: 'Query', sykmelding: sykmelding } },
                }),
                createMock({
                    request: { query: SykmeldingerDocument },
                    result: { data: { __typename: 'Query', sykmeldinger: [sykmelding] } },
                }),
                createMock({
                    request: { query: BrukerinformasjonDocument, variables: { sykmeldingId: 'sykmelding-id' } },
                    result: {
                        data: null,
                        errors: [new Error('Some backend error')],
                        extensions: { dontLog: true },
                    },
                }),
            ],
        })

        expect(await screen.findByRole('heading', { name: 'Opplysninger fra sykmeldingen' })).toBeInTheDocument()
        expect(await screen.findByText(/Vi klarte dessverre ikke å hente informasjonen/)).toBeInTheDocument()
    })
})
