import { describe, expect, it } from 'vitest'

import { mockPublicRuntimeConfig } from './test/mockRuntimeConfig'
import { oppfolgingsplanUrl } from './environment'

describe('oppfolgingsplanUrl', () => {
    it('bruker gammel url når ny oppfolgingsplan ikke er aktivert', () => {
        expect(oppfolgingsplanUrl()).toEqual(mockPublicRuntimeConfig.oppfolgingsplanUrl)
    })

    it('bruker ny url når ny oppfolgingsplan er aktivert', () => {
        mockPublicRuntimeConfig.nyOppfolgingsplanEnabled = 'true'

        expect(oppfolgingsplanUrl()).toEqual(mockPublicRuntimeConfig.nyOppfolgingsplanUrl)
    })
})
