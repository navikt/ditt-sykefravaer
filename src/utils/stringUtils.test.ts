import { describe, it, expect } from 'vitest'

import { pluralize } from './stringUtils'

describe('stringUtils', function () {
    describe('pluralize', function () {
        it('skal sette sykmelding i flertall', function () {
            expect(pluralize('sykmelding', 1)).toEqual('1 sykmelding')
            expect(pluralize('sykmelding', 2)).toEqual('2 sykmeldinger')
        })
    })
})
