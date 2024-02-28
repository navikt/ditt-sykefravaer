import { logAmplitudeEvent } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'

import { amplitudeEnabled } from '../../utils/environment'

export type validEventNames =
    | 'navigere'
    | 'alert vist'
    | 'knapp klikket'
    | 'komponent vist'
    | 'expansioncard åpnet'
    | 'expansioncard lukket' //Bruk kun navn fra taksonomien

export const logEvent = (eventName: validEventNames, eventData: Record<string, string | boolean | number>) => {
    if (window) {
        if (amplitudeEnabled()) {
            logAmplitudeEvent({
                origin: 'ditt-sykefravaer',
                eventName,
                eventData,
            }).catch((e) => logger.warn(`Feil ved amplitude logging`, e))
        } else {
            // eslint-disable-next-line no-console
            console.log(`Logger ${eventName} - Event properties: ${JSON.stringify(eventData)}!`)
        }
    }
}
