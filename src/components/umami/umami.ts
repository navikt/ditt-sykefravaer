import type { EventName, PropertiesFor } from '@navikt/nav-dekoratoren-moduler'
import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'

import { isOpplaering, isProd, umamiEnabled } from '../../utils/environment'

const analytics = getAnalyticsInstance('ditt-sykefravaer')

export const logEvent = <TEventName extends EventName, TEventData extends PropertiesFor<TEventName>>(
    eventName: TEventName,
    eventData: TEventData,
) => {
    if (typeof window === 'undefined') {
        return
    }

    if (umamiEnabled()) {
        analytics(eventName, eventData).catch((e) => logger.warn(`Feil ved umami logging`, e))
    } else if (!isProd() && isOpplaering()) {
        // eslint-disable-next-line no-console
        console.log(`Logger ${eventName} - Event properties: ${JSON.stringify(eventData)}!`)
    }
}
