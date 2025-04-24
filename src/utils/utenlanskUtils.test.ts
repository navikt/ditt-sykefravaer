import { describe, expect, it } from 'vitest'

import { createSykmelding } from './test/dataUtils'
import { isUtenlandsk } from './utenlanskUtils'

describe('isUtenlanssk', () => {
    it('burde være false dersom utenlandskSykmelding er undefined', () => {
        const sykmelding = createSykmelding({
            utenlandskSykmelding: undefined,
        })
        expect(isUtenlandsk(sykmelding)).toBeFalsy()
    })

    it('burde være false dersom utenlandskSykmelding er null', () => {
        const sykmelding = createSykmelding({
            utenlandskSykmelding: null,
        })
        expect(isUtenlandsk(sykmelding)).toBeFalsy()
    })
})
