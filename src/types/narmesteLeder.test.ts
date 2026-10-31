import { describe, it, expect } from 'vitest'

import { Linemanager, tilNarmesteLeder } from './narmesteLeder'

describe('tilNarmesteLeder', () => {
    it('mapper leder med fornavn og etternavn', () => {
        const dto: Linemanager = {
            id: 'uuid-1',
            orgNumber: '123456789',
            activeFrom: '2024-01-01',
            name: {
                firstName: 'Kari',
                middleName: null,
                lastName: 'Nordmann',
            },
            emailAddresses: ['leder@example.com'],
            mobile: '12345678',
        }

        const resultat = tilNarmesteLeder(dto)

        expect(resultat).toEqual({
            id: 'uuid-1',
            navn: 'Kari Nordmann',
            orgnummer: '123456789',
            aktivFom: '2024-01-01',
        })
    })

    it('mapper leder med fornavn, mellomnavn og etternavn', () => {
        const dto: Linemanager = {
            id: 'uuid-2',
            orgNumber: '987654321',
            activeFrom: '2023-05-15',
            name: {
                firstName: 'Ola',
                middleName: 'Mellom',
                lastName: 'Nordmann',
            },
            emailAddresses: ['ola@example.com'],
            mobile: '87654321',
        }

        const resultat = tilNarmesteLeder(dto)

        expect(resultat.navn).toBe('Ola Mellom Nordmann')
    })

    it('gir ikke dobbelt mellomrom når middleName er null eller tom', () => {
        const dtoMedNull: Linemanager = {
            id: 'uuid-3',
            orgNumber: '123456789',
            activeFrom: '2024-01-01',
            name: {
                firstName: 'Kari',
                middleName: null,
                lastName: 'Nordmann',
            },
            emailAddresses: [],
            mobile: null,
        }

        const resultat = tilNarmesteLeder(dtoMedNull)

        expect(resultat.navn).toBe('Kari Nordmann')
        expect(resultat.navn).not.toContain('  ')
    })

    it('tar ikke med emailAddresses eller mobile i NarmesteLeder', () => {
        const dto: Linemanager = {
            id: 'uuid-4',
            orgNumber: '123456789',
            activeFrom: '2024-01-01',
            name: {
                firstName: 'Kari',
                middleName: null,
                lastName: 'Nordmann',
            },
            emailAddresses: ['leder@example.com'],
            mobile: '99999999',
        }

        const resultat = tilNarmesteLeder(dto)

        expect(resultat).not.toHaveProperty('emailAddresses')
        expect(resultat).not.toHaveProperty('mobile')
        expect(Object.keys(resultat).sort()).toEqual(['aktivFom', 'id', 'navn', 'orgnummer'].sort())
    })
})
