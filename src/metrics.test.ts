import { describe, it, expect } from 'vitest'

import { cleanPathForMetric } from './metrics'

describe('cleanPathForMetric', () => {
    it('erstatter UUID med [uuid] for sletting av nærmeste leder', () => {
        const path = 'DELETE /linemanager/00000000-0000-4000-8000-000000000001'
        const rensetPath = cleanPathForMetric(path)

        expect(rensetPath).toBe('DELETE /linemanager/[uuid]')
    })

    it('beholder sti for uthenting av nærmeste leder uendret', () => {
        const path = 'GET /employee/linemanager'
        const rensetPath = cleanPathForMetric(path)

        expect(rensetPath).toBe('GET /employee/linemanager')
    })
})
