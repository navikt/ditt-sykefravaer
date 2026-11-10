import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Linemanager, tilNarmesteLeder } from '../types/narmesteLeder'

import useAvkreftNarmesteLeder from './useAvkreftNarmesteLeder'
import useNarmesteledere, { narmesteledereKey } from './useNarmesteledere'

const testperson = vi.hoisted(() => ({ query: '' }))
vi.mock('./useTestpersonQuery', () => ({ UseTestpersonQuery: () => ({ query: () => testperson.query }) }))
vi.mock('../utils/environment', () => ({ isMockBackend: () => true }))

const leder: Linemanager = {
    id: 'leder-1',
    orgNumber: '123456789',
    activeFrom: '2024-01-01',
    name: { firstName: 'Albus', middleName: null, lastName: 'Dumbledore' },
    emailAddresses: [],
    mobile: null,
}
const annenLeder: Linemanager = { ...leder, id: 'leder-2' }

function svar(ledere: Linemanager[]) {
    return new Response(JSON.stringify({ linemanagers: ledere }), { status: 200 })
}

function oppsett() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    function Wrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={client}>{children}</QueryClientProvider>
    }
    return { client, wrapper: Wrapper }
}

afterEach(() => {
    vi.unstubAllGlobals()
    testperson.query = ''
})

describe('avkrefting av nærmeste leder', () => {
    it('fjerner bare valgt leder etter 202 uten automatisk oppfølgende GET', async () => {
        const { client, wrapper } = oppsett()
        const fetch = vi.fn((_url: string, init?: RequestInit) =>
            Promise.resolve(
                init?.method === 'DELETE' ? new Response(null, { status: 202 }) : svar([leder, annenLeder]),
            ),
        )
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(2))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        await waitFor(() => expect(liste.result.current.data?.map((l) => l.id)).toEqual([annenLeder.id]))
        expect(fetch).toHaveBeenCalledTimes(2)
        client.clear()
    })

    it('oppdaterer bare cachen for valgt testperson', async () => {
        const { client, wrapper } = oppsett()
        const forste = '?testperson=forste'
        const andre = '?testperson=andre'
        testperson.query = forste
        client.setQueryData(narmesteledereKey(forste), [tilNarmesteLeder(leder)])
        client.setQueryData(narmesteledereKey(andre), [tilNarmesteLeder(leder)])
        const fetch = vi.fn(() => Promise.resolve(new Response(null, { status: 202 })))
        vi.stubGlobal('fetch', fetch)
        const hook = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await act(async () => {
            await hook.result.current.mutateAsync()
        })
        expect(client.getQueryData(narmesteledereKey(forste))).toEqual([])
        expect(client.getQueryData<{ id: string }[]>(narmesteledereKey(andre))?.map((l) => l.id)).toEqual([leder.id])
        client.clear()
    })

    it('beholder lederen ved feilende DELETE', async () => {
        const { client, wrapper } = oppsett()
        client.setQueryData(narmesteledereKey(''), [tilNarmesteLeder(leder)])
        vi.stubGlobal(
            'fetch',
            vi.fn(() => Promise.resolve(new Response(null, { status: 500 }))),
        )
        const { result: avkreft } = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await act(async () => {
            await expect(avkreft.current.mutateAsync()).rejects.toThrow()
        })
        expect(client.getQueryData(narmesteledereKey(''))).toEqual([tilNarmesteLeder(leder)])
        client.clear()
    })
})
