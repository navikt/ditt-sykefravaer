/*import dayjs from 'dayjs'
import FetchMock, { MiddlewareUtils } from 'yet-another-fetch-mock'

import { isOpplaering } from '../../utils/environment'

import { Persona } from './data/persona'
import { defaultPersona } from './data/personas'
import { personas } from './testperson'

const mock = FetchMock.configure({
    enableFallback: true,
    middleware: isOpplaering()
        ? MiddlewareUtils.combine(MiddlewareUtils.delayMiddleware(500))
        : MiddlewareUtils.combine(MiddlewareUtils.loggingMiddleware()),
})

function setUpMock(persona: Persona) {


    mock.get('https://www.nav.no/person/innloggingsstatus/auth', (req, res, ctx) => res(ctx.json({})))
}

const url = new URL(window.location.href)

const testperson = url.searchParams.get('testperson')
if (testperson && Object.prototype.hasOwnProperty.call(personas, testperson)) {
    setUpMock(personas[testperson]())
} else {
    setUpMock(defaultPersona)
}
*/
