import 'dayjs/locale/nb'

import { expect } from '@jest/globals'

import { tekst } from '../../utils/tekster'

it('Returns text from bundle', () => {
    const text = tekst('sidetittel.liste')
    expect(text).toEqual('Ditt sykefravær')
})
