import { describe, expect, it } from 'vitest'

import { tillatteApier } from '../pages/api/narmesteleder/[[...path]]'

import { byggBackendSti } from './backendproxy'

describe('byggBackendSti', () => {
    it('legger prefix foran stien når prefix er oppgitt', () => {
        expect(byggBackendSti('/employee/linemanager', '/internal/api/v1')).toBe(
            '/internal/api/v1/employee/linemanager',
        )
    })

    it('beholder stien uendret uten prefix', () => {
        expect(byggBackendSti('/api/v1/meldinger')).toBe('/api/v1/meldinger')
        expect(byggBackendSti('/api/v1/meldinger', '')).toBe('/api/v1/meldinger')
    })
})

describe('narmesteleder-proxy', () => {
    it('har ingen nettleservendte stier med /internal, siden ingressen blokkerer dem', () => {
        expect(tillatteApier.length).toBeGreaterThan(0)
        tillatteApier.forEach((api) => expect(api).not.toContain('/internal'))
    })
})
