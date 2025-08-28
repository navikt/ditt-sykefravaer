import { describe, it, expect } from 'vitest'

import { urlAppendPath } from './urlUtils'

describe('urlAppendPath', () => {
    it('handles simple relative path', () => {
        expect(urlAppendPath('/foo', 'bar')).toBe('/foo/bar')
    })

    it('handles relative path with trailing slash', () => {
        expect(urlAppendPath('/foo/', 'bar')).toBe('/foo/bar')
    })

    it('handles relative path with query params', () => {
        expect(urlAppendPath('/foo?x=1', 'bar')).toBe('/foo/bar?x=1')
    })

    it('handles relative path with hash', () => {
        expect(urlAppendPath('/foo#section', 'bar')).toBe('/foo/bar#section')
    })

    it('handles relative path with query and hash', () => {
        expect(urlAppendPath('/foo?x=1#section', 'bar')).toBe('/foo/bar?x=1#section')
    })

    it('handles absolute URL', () => {
        expect(urlAppendPath('https://example.com/foo', 'bar')).toBe('https://example.com/foo/bar')
    })

    it('handles absolute URL with query and hash', () => {
        expect(urlAppendPath('https://example.com/foo?x=1#section', 'bar')).toBe(
            'https://example.com/foo/bar?x=1#section',
        )
    })

    it('handles subPath with leading slash', () => {
        expect(urlAppendPath('/foo', '/bar')).toBe('/foo/bar')
    })

    it('handles root path', () => {
        expect(urlAppendPath('/', 'bar')).toBe('/bar')
    })
})
