import { describe, expect, it } from 'vitest'

import { tillatteApier } from '../pages/api/narmesteleder/[[...path]]'

describe('narmesteleder-proxy', () => {
    it('har ingen nettleservendte stier med /internal, siden ingressen blokkerer dem', () => {
        expect(tillatteApier.length).toBeGreaterThan(0)
        tillatteApier.forEach((api) => expect(api).not.toContain('/internal'))
    })
})
