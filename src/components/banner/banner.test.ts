import 'dayjs/locale/nb'

import { tekst } from '../../utils/tekster'

it('Returns text from bundle', () => {
    const text = tekst('sidetittel.liste')
    expect(text).toEqual('Ditt sykefravær')
})
