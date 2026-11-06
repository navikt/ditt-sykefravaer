import { describe, expect, it } from 'vitest'

import { Linemanager, tilNarmesteLeder } from './narmesteLeder'

const lagLinemanager = (middleName: string | null): Linemanager => ({
    id: '00000000-0000-4000-8000-000000000001',
    orgNumber: '123456789',
    activeFrom: '2024-01-01T08:00:00Z',
    name: { firstName: 'Kari', middleName, lastName: 'Nordmann' },
    emailAddresses: ['leder@example.test'],
    mobile: '00000000',
})

describe('tilNarmesteLeder', () => {
    it('mapper til klientmodellen uten e-post og mobil', () => {
        expect(tilNarmesteLeder(lagLinemanager(null))).toEqual({
            id: '00000000-0000-4000-8000-000000000001',
            navn: 'Kari Nordmann',
            orgnummer: '123456789',
            aktivFom: '2024-01-01T08:00:00Z',
        })
    })

    it('beholder lederen uten navn i klientmodellen', () => {
        expect(tilNarmesteLeder({ ...lagLinemanager(null), name: null })).toEqual({
            id: '00000000-0000-4000-8000-000000000001',
            navn: '',
            orgnummer: '123456789',
            aktivFom: '2024-01-01T08:00:00Z',
        })
    })

    it('mapper både ledere med og uten navn i samme svar', () => {
        const ledere = [
            { ...lagLinemanager(null), id: 'uten-navn', name: null },
            { ...lagLinemanager('Mellom'), id: 'med-navn' },
        ].map(tilNarmesteLeder)

        expect(ledere.map(({ id, navn }) => ({ id, navn }))).toEqual([
            { id: 'uten-navn', navn: '' },
            { id: 'med-navn', navn: 'Kari Mellom Nordmann' },
        ])
    })

    it('tar med mellomnavn når det finnes', () => {
        expect(tilNarmesteLeder(lagLinemanager('Mellom')).navn).toBe('Kari Mellom Nordmann')
    })
})
