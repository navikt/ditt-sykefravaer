import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Linemanager } from '../types/narmesteLeder'

import useAvkreftNarmesteLeder from './useAvkreftNarmesteLeder'
import useNarmesteledere from './useNarmesteledere'

const testperson = vi.hoisted(() => ({ query: '', mockBackend: true }))
vi.mock('./useTestpersonQuery', () => ({ UseTestpersonQuery: () => ({ query: () => testperson.query }) }))
vi.mock('../utils/environment', () => ({ isMockBackend: () => testperson.mockBackend }))

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
    testperson.mockBackend = true
})

describe('avkrefting av nærmeste leder', () => {
    it('skjuler lederen ved pågående og senere utdaterte GET-svar, også etter feil, frem til backend er oppdatert', async () => {
        const { wrapper } = oppsett()
        let get: () => Promise<Response> = async () => svar([leder, annenLeder])
        let fullforGammelGet: (response: Response) => void = () => {
            throw new Error('GET ikke startet')
        }
        vi.stubGlobal(
            'fetch',
            vi.fn((_url: string, init?: RequestInit) =>
                init?.method === 'DELETE' ? Promise.resolve(new Response(null, { status: 202 })) : get(),
            ),
        )

        const { result: liste } = renderHook(() => useNarmesteledere(), { wrapper })
        const { result: avkreft } = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await waitFor(() => expect(liste.current.data?.map((l) => l.id)).toEqual([leder.id, annenLeder.id]))

        get = () =>
            new Promise((resolve) => {
                fullforGammelGet = resolve
            })
        let gammelGet: Promise<unknown>
        act(() => {
            gammelGet = liste.current.refetch()
        })
        await act(async () => {
            await avkreft.current.mutateAsync()
        })
        await waitFor(() => expect(liste.current.data?.map((l) => l.id)).toEqual([annenLeder.id]))
        await act(async () => {
            fullforGammelGet(svar([leder, annenLeder]))
            await gammelGet
        })
        expect(liste.current.data?.map((l) => l.id)).toEqual([annenLeder.id])

        get = async () => svar([leder, annenLeder])
        await act(async () => {
            await liste.current.refetch()
        })
        expect(liste.current.data?.map((l) => l.id)).toEqual([annenLeder.id])

        get = async () => new Response(null, { status: 500 })
        await act(async () => {
            expect((await liste.current.refetch()).isError).toBe(true)
        })
        get = async () => svar([leder, annenLeder])
        await act(async () => {
            await liste.current.refetch()
        })
        expect(liste.current.data?.map((l) => l.id)).toEqual([annenLeder.id])

        get = async () => svar([annenLeder])
        await act(async () => {
            await liste.current.refetch()
        })
        expect(liste.current.data?.map((l) => l.id)).toEqual([annenLeder.id])
        get = async () => svar([leder, annenLeder])
        await act(async () => {
            await liste.current.refetch()
        })
        await waitFor(() => expect(liste.current.data?.map((l) => l.id)).toEqual([leder.id, annenLeder.id]))
    })

    it('beholder lederen ved feilende DELETE', async () => {
        const { wrapper } = oppsett()
        vi.stubGlobal(
            'fetch',
            vi.fn((_url: string, init?: RequestInit) =>
                init?.method === 'DELETE'
                    ? Promise.resolve(new Response(null, { status: 500 }))
                    : Promise.resolve(svar([leder])),
            ),
        )
        const { result: liste } = renderHook(() => useNarmesteledere(), { wrapper })
        const { result: avkreft } = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await waitFor(() => expect(liste.current.data?.map((l) => l.id)).toEqual([leder.id]))
        await act(async () => {
            await expect(avkreft.current.mutateAsync()).rejects.toThrow()
        })
        await act(async () => {
            await liste.current.refetch()
        })
        expect(liste.current.data?.map((l) => l.id)).toEqual([leder.id])
    })

    it('avgrenser beskyttelsen til QueryClient og testperson og beholder den ved remontering', async () => {
        const { client, wrapper } = oppsett()
        vi.stubGlobal(
            'fetch',
            vi.fn((_url: string, init?: RequestInit) =>
                init?.method === 'DELETE'
                    ? Promise.resolve(new Response(null, { status: 202 }))
                    : Promise.resolve(svar([leder])),
            ),
        )
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        liste.unmount()
        client.removeQueries({ queryKey: ['narmesteledere'] })
        const nyListe = renderHook(() => useNarmesteledere(), { wrapper })
        await waitFor(() => expect(nyListe.result.current.data).toEqual([]))

        testperson.query = '?testperson=annen'
        nyListe.rerender()
        await waitFor(() => expect(nyListe.result.current.data?.map((l) => l.id)).toEqual([leder.id]))
        testperson.query = ''
        const annenClient = oppsett()
        const isolertListe = renderHook(() => useNarmesteledere(), { wrapper: annenClient.wrapper })
        await waitFor(() => expect(isolertListe.result.current.data?.map((l) => l.id)).toEqual([leder.id]))
    })
})
