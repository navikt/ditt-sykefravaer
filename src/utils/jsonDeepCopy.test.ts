import { jsonDeepCopy } from './jsonDeepCopy'

it('Kopierer json', () => {
    const original = { hei: '123' }
    const kopi = jsonDeepCopy(original)
    expect(original).toEqual(kopi)
})

