import type { EventName, PropertiesFor } from '@navikt/nav-dekoratoren-moduler'
import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'
import { useLayoutEffect, useRef } from 'react'

import { isOpplaering, isProd, umamiEnabled } from '../../utils/environment'

type UmamiVerdi = string | boolean | number | null | undefined
type EkstraUmamiData = Record<string, UmamiVerdi>

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

export async function logUmamiEvent<
    TEventName extends EventName,
    TEventData extends PropertiesFor<TEventName>,
    TEkstraData extends EkstraUmamiData = Record<never, never>,
>(event: { eventName: TEventName; data: TEventData }, extraData?: TEkstraData): Promise<void> {
    try {
        if (extraData == null) {
            logEvent(event.eventName, event.data)
            return
        }

        logEvent<TEventName, TEventData & TEkstraData>(event.eventName, {
            ...event.data,
            ...extraData,
        })
    } catch (e) {
        logger.warn(new Error('Failed to log umami event', { cause: e }))
    }
}

export function useLogUmamiEvent<
    TEventName extends EventName,
    TEventData extends PropertiesFor<TEventName>,
    TEkstraData extends EkstraUmamiData = Record<never, never>,
>(
    event: { eventName: TEventName; data: TEventData },
    extraData?: TEkstraData,
    condition: () => boolean = () => true,
): void {
    const stableEvent = useRef(event)
    const stableExtraData = useRef(extraData)
    const stableCondition = useRef(condition)

    useLayoutEffect(() => {
        if (stableCondition.current()) {
            logUmamiEvent(stableEvent.current, stableExtraData.current)
        }
    }, [])
}
