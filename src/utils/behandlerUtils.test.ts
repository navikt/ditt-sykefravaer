import { describe, it, expect } from 'vitest'

import { Behandler } from '../types/sykmelding/sykmelding'

import { getBehandlerName } from './behandlerUtils'

describe('behandlerUtils', () => {
    describe('getName', () => {
        it('Gets full name if mellomnavn is defined', () => {
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

        it('Gets partial name if mellomnavn is null', () => {
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
