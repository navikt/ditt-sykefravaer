import { describe, it, expect } from 'vitest'

import { Behandler } from '../types/sykmelding/sykmelding'

import { getBehandlerName } from './behandlerUtils'

describe('behandlerUtils', () => {
    describe('getName', () => {
        it('Henter fullt navn hvis mellomnavn er definert', () => {
            const behandler: Behandler = {
                fornavn: 'Ola',
                mellomnavn: 'Robert',
                etternavn: 'Normann',
                adresse: {
                    gate: null,
                    postnummer: null,
                    kommune: null,
                    postboks: null,
                    land: null,
                },
                tlf: null,
            }

            expect(getBehandlerName(behandler)).toBe('Ola Robert Normann')
        })

        it('Henter delvis navn hvis mellomnavn er null', () => {
            const behandler: Behandler = {
                fornavn: 'Ola',
                mellomnavn: null,
                etternavn: 'Normann',
                adresse: {
                    gate: null,
                    postnummer: null,
                    kommune: null,
                    postboks: null,
                    land: null,
                },
                tlf: null,
            }

            expect(getBehandlerName(behandler)).toBe('Ola Normann')
        })
    })
})
