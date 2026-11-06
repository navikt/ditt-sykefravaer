import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NarmesteLeder } from '../types/narmesteLeder'

import useAvkreftNarmesteLeder from './useAvkreftNarmesteLeder'
import useNarmesteledere, { narmesteledereKey, useAvkreftedeLedere } from './useNarmesteledere'

const testperson = vi.hoisted(() => ({ query: '', mockBackend: true }))
vi.mock('./useTestpersonQuery', () => ({ UseTestpersonQuery: () => ({ query: () => testperson.query }) }))
vi.mock('../utils/environment', () => ({ isMockBackend: () => testperson.mockBackend }))

const leder: NarmesteLeder = { id: 'leder-1', navn: 'Kari Nordmann', orgnummer: '123', aktivFom: '2024-01-01' }
const annenLeder: NarmesteLeder = { ...leder, id: 'leder-2' }
const dto = {
    id: leder.id,
    orgNumber: leder.orgnummer,
    activeFrom: leder.aktivFom,
    name: { firstName: 'Kari', middleName: null, lastName: 'Nordmann' },
    emailAddresses: [],
    mobile: null,
}
const svar = (ledere = [dto]) => new Response(JSON.stringify({ linemanagers: ledere }), { status: 200 })

function oppsett() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    function Wrapper({ children }: { children: ReactNode }) {
        return <QueryClientProvider client={client}>{children}</QueryClientProvider>
    }
    return { client, wrapper: Wrapper }
}

afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    testperson.query = ''
    testperson.mockBackend = true
})

describe('oppfølging av avkreftet leder', () => {
    it('bruker id og testperson fra kallet når begge endres mens DELETE pågår', async () => {
        const { client, wrapper } = oppsett()
        const forste = '?testperson=forste'
        const andre = '?testperson=andre'
        testperson.query = forste
        client.setQueryData(narmesteledereKey(forste), [leder, annenLeder])
        client.setQueryData(narmesteledereKey(andre), [leder, annenLeder])
        let fullfor: (svar: Response) => void = () => {
            throw new Error('DELETE ikke startet')
        }
        const fetch = vi.fn(
            (_url: string) =>
                new Promise<Response>((resolve) => {
                    fullfor = resolve
                }),
        )
        vi.stubGlobal('fetch', fetch)
        const hook = renderHook(({ id }) => useAvkreftNarmesteLeder(id), {
            wrapper,
            initialProps: { id: leder.id },
        })
        let foresporsel: Promise<unknown> = Promise.resolve()
        act(() => {
            foresporsel = hook.result.current.mutateAsync()
        })
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
        expect(fetch.mock.calls[0][0]).toContain('/linemanager/leder-1?testperson=forste')
        testperson.query = andre
        hook.rerender({ id: annenLeder.id })
        await act(async () => {
            fullfor(new Response(null, { status: 202 }))
            await foresporsel
        })
        expect(client.getQueryData<NarmesteLeder[]>(narmesteledereKey(forste))).toEqual([annenLeder])
        expect(client.getQueryData<NarmesteLeder[]>(narmesteledereKey(andre))).toEqual([leder, annenLeder])
        client.clear()
    })

    it('følger opp 202 et begrenset antall ganger og beholder beskyttelsen ved feil og utdaterte svar', async () => {
        const { client, wrapper } = oppsett()
        let getAntall = 0
        const fetch = vi.fn((_url: string, init?: RequestInit) => {
            if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
            getAntall++
            return Promise.resolve(getAntall === 2 ? new Response(null, { status: 500 }) : svar())
        })
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        vi.useFakeTimers()
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        expect(client.getQueryData(narmesteledereKey(''))).toEqual([])
        for (let i = 0; i < 4; i++) {
            await act(async () => {
                await vi.advanceTimersByTimeAsync(2000)
            })
        }
        expect(getAntall).toBe(4)
        expect(liste.result.current.data).toEqual([])
        await act(async () => {
            await liste.result.current.refetch()
        })
        expect(liste.result.current.data).toEqual([])
        client.clear()
    })

    it('fjerner ventemarkøren etter et nytt svar uten lederen og viser samme ID ved reaktivering', async () => {
        const { client, wrapper } = oppsett()
        let getAntall = 0
        const fetch = vi.fn((_url: string, init?: RequestInit) => {
            if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
            getAntall++
            return Promise.resolve(getAntall === 2 ? svar([]) : svar())
        })
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const ventende = renderHook(() => useAvkreftedeLedere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        vi.useFakeTimers()
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        await act(async () => {
            await vi.advanceTimersByTimeAsync(10000)
        })
        expect(getAntall).toBe(2)
        expect(ventende.result.current).toEqual([])
        await act(async () => {
            await liste.result.current.refetch()
        })
        expect(client.getQueryData<NarmesteLeder[]>(narmesteledereKey(''))?.map((l) => l.id)).toEqual([leder.id])
        vi.useRealTimers()
        const nySesjon = oppsett()
        const nyListe = renderHook(() => useNarmesteledere(), { wrapper: nySesjon.wrapper })
        await waitFor(() => expect(nyListe.result.current.data?.map((l) => l.id)).toEqual([leder.id]))
        nySesjon.client.clear()
        client.clear()
    })

    it('stopper oppfølging når listen for testpersonen ikke lenger er aktiv', async () => {
        const { client, wrapper } = oppsett()
        testperson.query = '?testperson=forste'
        const fetch = vi.fn((_url: string, init?: RequestInit) =>
            Promise.resolve(init?.method === 'DELETE' ? new Response(null, { status: 202 }) : svar()),
        )
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        vi.useFakeTimers()
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        liste.unmount()
        avkreft.unmount()
        await act(async () => {
            await vi.advanceTimersByTimeAsync(10000)
        })
        expect(fetch).toHaveBeenCalledTimes(2)
        client.clear()
    })

    it('lar ikke et tomt GET-svar startet før avkrefting fjerne ventemarkøren', async () => {
        const { client, wrapper } = oppsett()
        let fullfor: (response: Response) => void = () => {
            throw new Error('GET ikke startet')
        }
        let gammel = false
        const fetch = vi.fn((_url: string, init?: RequestInit) => {
            if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
            if (gammel)
                return new Promise<Response>((resolve) => {
                    fullfor = resolve
                })
            return Promise.resolve(svar())
        })
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const ventende = renderHook(() => useAvkreftedeLedere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id, leder.orgnummer), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        gammel = true
        let foresporsel: Promise<unknown> = Promise.resolve()
        act(() => {
            foresporsel = liste.result.current.refetch()
        })
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        await act(async () => {
            fullfor(svar([]))
            await foresporsel
        })
        await waitFor(() => expect(ventende.result.current.map((nl) => nl.orgnummer)).toEqual([leder.orgnummer]))
        gammel = false
        await act(async () => {
            await liste.result.current.refetch()
        })
        expect(client.getQueryData(narmesteledereKey(''))).toEqual([])
        client.clear()
    })

    it('lar ikke et tomt svar etter første avkrefting fjerne markøren fra en senere avkrefting', async () => {
        const { wrapper } = oppsett()
        let fullfor: (response: Response) => void = () => {
            throw new Error('GET ikke startet')
        }
        let vent = false
        const fetch = vi.fn((_url: string, init?: RequestInit) => {
            if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
            if (vent)
                return new Promise<Response>((resolve) => {
                    fullfor = resolve
                })
            return Promise.resolve(svar())
        })
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const ventende = renderHook(() => useAvkreftedeLedere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id, leder.orgnummer), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        vent = true
        let foresporsel: Promise<unknown> = Promise.resolve()
        act(() => {
            foresporsel = liste.result.current.refetch()
        })
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        await act(async () => {
            fullfor(svar([]))
            await foresporsel
        })
        await waitFor(() => expect(ventende.result.current.map((nl) => nl.orgnummer)).toEqual([leder.orgnummer]))
    })

    it.each([500, 200])(
        'beholder ventestatus for arbeidsgiver etter tre GET-svar med status %i og remontering',
        async (status) => {
            const { client, wrapper } = oppsett()
            let getAntall = 0
            const fetch = vi.fn((_url: string, init?: RequestInit) => {
                if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
                getAntall++
                return Promise.resolve(getAntall === 1 || status === 200 ? svar() : new Response(null, { status }))
            })
            vi.stubGlobal('fetch', fetch)
            const liste = renderHook(() => useNarmesteledere(), { wrapper })
            const ventende = renderHook(() => useAvkreftedeLedere(), { wrapper })
            const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id, leder.orgnummer), { wrapper })
            await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
            vi.useFakeTimers()
            await act(async () => {
                await avkreft.result.current.mutateAsync()
            })
            for (let i = 0; i < 4; i++) {
                await act(async () => {
                    await vi.advanceTimersByTimeAsync(2000)
                })
            }
            expect(getAntall).toBe(4)
            expect(ventende.result.current.map((nl) => nl.orgnummer)).toEqual([leder.orgnummer])
            ventende.unmount()
            vi.useRealTimers()
            const remontert = renderHook(() => useAvkreftedeLedere(), { wrapper })
            await waitFor(() => expect(remontert.result.current.map((nl) => nl.orgnummer)).toEqual([leder.orgnummer]))
            client.clear()
        },
    )

    it('viser samme ID hvis et eldre svar kommer tilbake etter et nytt tomt svar', async () => {
        const { wrapper } = oppsett()
        let antall = 0
        vi.stubGlobal(
            'fetch',
            vi.fn((_url: string, init?: RequestInit) => {
                if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
                antall++
                return Promise.resolve(antall === 2 ? svar([]) : svar())
            }),
        )
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id, leder.orgnummer), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        await act(async () => {
            await liste.result.current.refetch()
        })
        await act(async () => {
            await liste.result.current.refetch()
        })
        await waitFor(() => expect(liste.result.current.data?.map((nl) => nl.id)).toEqual([leder.id]))
    })

    it('beholder beskyttelsen når standard testperson får eksplisitt navn', async () => {
        const { wrapper } = oppsett()
        vi.stubGlobal(
            'fetch',
            vi.fn((_url: string, init?: RequestInit) =>
                Promise.resolve(init?.method === 'DELETE' ? new Response(null, { status: 202 }) : svar()),
            ),
        )
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const ventende = renderHook(() => useAvkreftedeLedere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id, leder.orgnummer), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.map((nl) => nl.id)).toEqual([leder.id]))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })

        testperson.query = '?testperson=default'
        liste.rerender()
        ventende.rerender()
        await act(async () => {
            await liste.result.current.refetch()
        })

        expect(liste.result.current.data).toEqual([])
        expect(ventende.result.current.map((nl) => nl.orgnummer)).toEqual([leder.orgnummer])
    })

    it('lar ikke testpersonparameteren splitte beskyttelsen mot ekte backend', async () => {
        const { wrapper } = oppsett()
        testperson.mockBackend = false
        testperson.query = '?testperson=forste'
        vi.stubGlobal(
            'fetch',
            vi.fn((_url: string, init?: RequestInit) =>
                Promise.resolve(init?.method === 'DELETE' ? new Response(null, { status: 202 }) : svar()),
            ),
        )
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const ventende = renderHook(() => useAvkreftedeLedere(), { wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id, leder.orgnummer), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.map((nl) => nl.id)).toEqual([leder.id]))
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })

        testperson.query = '?testperson=andre'
        liste.rerender()
        ventende.rerender()
        await act(async () => {
            await liste.result.current.refetch()
        })

        expect(liste.result.current.data).toEqual([])
        expect(ventende.result.current.map((nl) => nl.orgnummer)).toEqual([leder.orgnummer])
    })

    it('teller ikke en kansellert GET som et fullført oppfølgingsforsøk', async () => {
        const { client, wrapper } = oppsett()
        const andreDto = { ...dto, id: annenLeder.id, orgNumber: '456' }
        let getAntall = 0
        const fetch = vi.fn((_url: string, init?: RequestInit) => {
            if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
            getAntall++
            if (getAntall === 2) {
                return new Promise<Response>((_resolve, reject) => {
                    init?.signal?.addEventListener('abort', () => reject(new DOMException('Avbrutt', 'AbortError')))
                })
            }
            return Promise.resolve(svar([dto, andreDto]))
        })
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper })
        const ventende = renderHook(() => useAvkreftedeLedere(), { wrapper })
        const avkreftForste = renderHook(() => useAvkreftNarmesteLeder(leder.id, leder.orgnummer), { wrapper })
        const avkreftAndre = renderHook(() => useAvkreftNarmesteLeder(annenLeder.id, '456'), { wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(2))
        await act(async () => {
            await avkreftForste.result.current.mutateAsync()
        })

        let gammelGet: Promise<unknown> = Promise.resolve()
        act(() => {
            gammelGet = liste.result.current.refetch()
        })
        await waitFor(() => expect(getAntall).toBe(2))
        await act(async () => {
            await avkreftAndre.result.current.mutateAsync()
            await gammelGet
        })
        await waitFor(() => {
            expect(ventende.result.current.find((nl) => nl.orgnummer === leder.orgnummer)?.forsok).toBe(0)
            expect(ventende.result.current.find((nl) => nl.orgnummer === '456')?.forsok).toBe(0)
        })

        await act(async () => {
            await liste.result.current.refetch()
        })
        await waitFor(() =>
            expect(ventende.result.current.find((nl) => nl.orgnummer === leder.orgnummer)?.forsok).toBe(1),
        )
        client.clear()
    })

    it.each([
        [500, 500, 500],
        [500, 200, 500],
    ])('begrenser oppfølging ved GET-svar %i, %i og %i med standard retry', async (...statuser) => {
        const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 }, mutations: { retry: false } } })
        function Wrapper({ children }: { children: ReactNode }) {
            return <QueryClientProvider client={client}>{children}</QueryClientProvider>
        }
        let getAntall = 0
        const fetch = vi.fn((_url: string, init?: RequestInit) => {
            if (init?.method === 'DELETE') return Promise.resolve(new Response(null, { status: 202 }))
            getAntall++
            const status = getAntall === 1 ? 200 : (statuser[getAntall - 2] ?? 500)
            return Promise.resolve(status === 200 ? svar() : new Response(null, { status }))
        })
        vi.stubGlobal('fetch', fetch)
        const liste = renderHook(() => useNarmesteledere(), { wrapper: Wrapper })
        const avkreft = renderHook(() => useAvkreftNarmesteLeder(leder.id), { wrapper: Wrapper })
        await waitFor(() => expect(liste.result.current.data?.length).toBe(1))
        vi.useFakeTimers()
        await act(async () => {
            await avkreft.result.current.mutateAsync()
        })
        for (let i = 0; i < 10; i++) {
            await act(async () => {
                await vi.advanceTimersByTimeAsync(2000)
            })
        }
        expect(getAntall).toBe(4)
        expect(client.getQueryData(narmesteledereKey(''))).toEqual([])

        let nyHenting: Promise<unknown> = Promise.resolve()
        act(() => {
            nyHenting = liste.result.current.refetch()
        })
        await act(async () => {
            await vi.advanceTimersByTimeAsync(100)
            await nyHenting
        })
        expect(getAntall).toBe(8)
        expect(client.getQueryData(narmesteledereKey(''))).toEqual([])
        client.clear()
    })
})
