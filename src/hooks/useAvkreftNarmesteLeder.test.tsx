import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Linemanager } from '../types/narmesteLeder'

import useAvkreftNarmesteLeder from './useAvkreftNarmesteLeder'
import useNarmesteledere, { AVKREFTET_NARMESTELEDER_QUERY_KEY } from './useNarmesteledere'

const leder1: Linemanager = {
    id: 'uuid-leder-1',
    orgNumber: '123456789',
    activeFrom: '2024-01-01',
    name: {
        firstName: 'Albus',
        middleName: null,
        lastName: 'Dumbledore',
    },
    emailAddresses: [],
    mobile: null,
}

const leder2: Linemanager = {
    id: 'uuid-leder-2',
    orgNumber: '987654321',
    activeFrom: '2024-01-01',
    name: {
        firstName: 'Severus',
        middleName: null,
        lastName: 'Snape',
    },
    emailAddresses: [],
    mobile: null,
}

describe('useAvkreftNarmesteLeder og useNarmesteledere regresjonstest for asynkron sletting', () => {
    let queryClient: QueryClient

    const createWrapper = () => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        })
        function Wrapper({ children }: { children: ReactNode }) {
            return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        }
        return Wrapper
    }

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('DELETE returnerer 202, neste GET er uoppdatert og inneholder fortsatt lederen, men lederen forblir skjult; senere GET uten lederen holder den fortsatt skjult', async () => {
        const wrapper = createWrapper()
        let getResponsePayload = { linemanagers: [leder1, leder2] }
        let getCallCount = 0
        let deleteCallCount = 0

        const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
            const method = init?.method ?? 'GET'
            if (method === 'DELETE') {
                deleteCallCount++
                // esyfo returnerer 202 Accepted med tom body ved sletting
                return Promise.resolve(new Response(null, { status: 202, statusText: 'Accepted' }))
            }
            if (method === 'GET' && url.includes('/internal/api/v1/employee/linemanager')) {
                getCallCount++
                return Promise.resolve(
                    new Response(JSON.stringify(getResponsePayload), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }),
                )
            }
            return Promise.reject(new Error(`Uventet kall: ${method} ${url}`))
        })

        vi.stubGlobal('fetch', fetchMock)

        // 1. Først hentes ledere og begge vises
        const { result: narmesteledereHook } = renderHook(() => useNarmesteledere(), { wrapper })

        await waitFor(() => expect(narmesteledereHook.current.isSuccess).toBe(true))
        expect(narmesteledereHook.current.data?.map((l) => l.id)).toEqual(['uuid-leder-1', 'uuid-leder-2'])
        expect(getCallCount).toBe(1)

        // 2. Avkreft leder 1 (Albus Dumbledore)
        const { result: avkreftHook } = renderHook(() => useAvkreftNarmesteLeder('uuid-leder-1'), { wrapper })

        await act(async () => {
            avkreftHook.current.mutate()
        })

        await waitFor(() => expect(avkreftHook.current.isSuccess).toBe(true))
        expect(deleteCallCount).toBe(1)

        // Leder 1 forsvinner umiddelbart fra cache og UI
        expect(narmesteledereHook.current.data?.map((l) => l.id)).toEqual(['uuid-leder-2'])
        expect(queryClient.getQueryData<string[]>(AVKREFTET_NARMESTELEDER_QUERY_KEY)).toContain('uuid-leder-1')

        // 3. Reconcile / refetch trigges (simulerer asynkront svar der esyfo ennå ikke har fjernet lederen)
        // getResponsePayload inneholder fremdeles leder1 her
        await waitFor(() => expect(getCallCount).toBeGreaterThanOrEqual(2), { timeout: 1000 })

        // Sjekk at leder 1 forblir skjult selv om GET returnerte leder 1
        expect(narmesteledereHook.current.data?.map((l) => l.id)).toEqual(['uuid-leder-2'])

        // 4. Senere GET der esyfo har fullført asynkron sletting og ikke lenger returnerer leder 1
        getResponsePayload = { linemanagers: [leder2] }

        await act(async () => {
            await narmesteledereHook.current.refetch()
        })

        expect(narmesteledereHook.current.data?.map((l) => l.id)).toEqual(['uuid-leder-2'])
    })

    it('feilende DELETE (500) fjerner ikke lederen fra listen eller avkreftet-listen', async () => {
        const wrapper = createWrapper()
        const getResponsePayload = { linemanagers: [leder1, leder2] }

        const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
            const method = init?.method ?? 'GET'
            if (method === 'DELETE') {
                return Promise.resolve(new Response('Feil i backend', { status: 500, statusText: 'Server Error' }))
            }
            if (method === 'GET' && url.includes('/internal/api/v1/employee/linemanager')) {
                return Promise.resolve(
                    new Response(JSON.stringify(getResponsePayload), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }),
                )
            }
            return Promise.reject(new Error(`Uventet kall: ${method} ${url}`))
        })

        vi.stubGlobal('fetch', fetchMock)

        const { result: narmesteledereHook } = renderHook(() => useNarmesteledere(), { wrapper })
        await waitFor(() => expect(narmesteledereHook.current.isSuccess).toBe(true))
        expect(narmesteledereHook.current.data?.map((l) => l.id)).toEqual(['uuid-leder-1', 'uuid-leder-2'])

        const { result: avkreftHook } = renderHook(() => useAvkreftNarmesteLeder('uuid-leder-1'), { wrapper })

        await act(async () => {
            avkreftHook.current.mutate()
        })

        await waitFor(() => expect(avkreftHook.current.isError).toBe(true))

        // Begge ledere forblir synlige
        expect(narmesteledereHook.current.data?.map((l) => l.id)).toEqual(['uuid-leder-1', 'uuid-leder-2'])
        expect(queryClient.getQueryData<string[]>(AVKREFTET_NARMESTELEDER_QUERY_KEY)).toBeUndefined()
    })
})
