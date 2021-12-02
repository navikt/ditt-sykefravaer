import express from 'express'
import path from 'path'

import { getHtmlWithDecorator } from './dekorator'
import { logger } from './logger'

const buildPath = path.resolve(__dirname, '../build')
const basePath = '/syk/sykefravaer'
const server = express()

server.use(express.json())
server.disable('x-powered-by')

function disableCache(res) {
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.setHeader('Expires', '-1')
}

server.get('/', (req, res) => {
    res.redirect(basePath)
})

server.get(`${basePath}/env-config-server.js`, (req, res) => {
    res.contentType('application/javascript; charset=UTF-8')
    disableCache(res)
    res.send(`window._env_ = {
    MOCK_BACKEND: '${process.env.MOCK_BACKEND}',
    ENVIRONMENT: '${process.env.ENVIRONMENT}',
    OPPLAERING: '${process.env.OPPLAERING}',
    SYKMELDINGER_BACKEND_PROXY_ROOT: '${process.env.SYKMELDINGER_BACKEND_PROXY_ROOT}',
    FLEX_GATEWAY_ROOT: '${process.env.FLEX_GATEWAY_ROOT}',
    SYFOAPI_ROOT: '${process.env.SYFOAPI_ROOT}',
    LOGINSERVICE_URL: '${process.env.LOGINSERVICE_URL}',
    LOGINSERVICE_REDIRECT_URL: '${process.env.LOGINSERVICE_REDIRECT_URL}',
    SYKEPENGESOKNAD_URL: '${process.env.SYKEPENGESOKNAD_URL}',
    SPINNSYN_URL: '${process.env.SPINNSYN_URL}',
    SYKMELDING_URL: '${process.env.SYKMELDING_URL}',
    AKTIVITETSPLAN_URL: '${process.env.AKTIVITETSPLAN_URL}',
    OPPFOLGINGSPLAN_URL: '${process.env.OPPFOLGINGSPLAN_URL}',
    DIALOGMOTE_URL: '${process.env.DIALOGMOTE_URL}',
    DITTNAV_URL: '${process.env.DITTNAV_URL}',
    SYKEPENGER_DOKUMENTER_URL: '${process.env.SYKEPENGER_DOKUMENTER_URL}',
    FRONTENDLOGGER_ROOT: '${process.env.FRONTENDLOGGER_ROOT}',
    NARMESTELEDER_URL: '${process.env.NARMESTELEDER_URL}',
    ARBEIDSSOKERREGISTRERING_URL: '${process.env.ARBEIDSSOKERREGISTRERING_URL}',
    ISDIALOGMOTE_ROOT: '${process.env.ISDIALOGMOTE_ROOT}',
}`)
})

server.use(`${basePath}`, express.static(buildPath, { index: false }))
server.get('/internal/isAlive|isReady', (req, res) =>
    res.sendStatus(200)
)

server.use('*', (req, res) =>
    getHtmlWithDecorator(`${buildPath}/index.html`)
        .then((html) => {
            disableCache(res)
            res.send(html)
        })
        .catch((e) => {
            logger.error(e)
            disableCache(res)
            res.status(500).send(e)
        })
)

const port = process.env.PORT || 8080
server.listen(port, () => logger.info(`App listening on port: ${port}`))
