import { AmplitudeClient } from 'amplitude-js'

import env from '../../utils/environment'

interface AmplitudeInstance {
    logEvent: (eventName: string, data?: Record<string, string>) => void
}


let amplitudeInstance: AmplitudeInstance | undefined

const getLogEventFunction = (): AmplitudeInstance => {
    if (window && env.amplitudeEnabled()) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const amplitudeJs = require('amplitude-js')
        const amplitudeInstance: AmplitudeClient = amplitudeJs.getInstance()
        amplitudeInstance.init(
            env.amplitudeKey(), undefined, {
                apiEndpoint: 'amplitude.nav.no/collect',
                saveEvents: false,
                includeUtm: true,
                batchEvents: false,
                includeReferrer: true,
                trackingOptions: {
                    city: false,
                    ip_address: false,
                    version_name: false,
                    region: false,
                    country: false,
                    dma: false,
                },
            },
        )
        return amplitudeInstance

    } else {
        return {
            logEvent: (eventName: string, data?: Record<string, string>) => {
                // eslint-disable-next-line no-console
                console.log(`Logger ${eventName} - Event properties: ${JSON.stringify(data)}!`)
            }
        }
    }
}

export const logEvent = (eventName: string, eventProperties: Record<string, string>) => {
    if (window) {
        if (amplitudeInstance) {
            amplitudeInstance.logEvent(eventName, eventProperties)
        } else {
            amplitudeInstance = getLogEventFunction()
            amplitudeInstance.logEvent(eventName, eventProperties)
        }
    }
}
