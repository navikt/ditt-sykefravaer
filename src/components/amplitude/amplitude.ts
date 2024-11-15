import { logAmplitudeEvent as logAmplDekoratoren } from '@navikt/nav-dekoratoren-moduler'
import { logger } from '@navikt/next-logger'
import { useLayoutEffect, useRef } from 'react'

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
            logAmplDekoratoren({
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

export async function logAmplitudeEvent(
    event: AmplitudeTaxonomyEvents,
    extraData?: Record<string, unknown>,
): Promise<void> {
    try {
        const baseEvent = taxonomyToAmplitudeEvent(event, extraData)
        logEvent(baseEvent.event_type as validEventNames, baseEvent.event_properties)
    } catch (e) {
        logger.warn(new Error('Failed to log amplitude event', { cause: e }))
    }
}

function taxonomyToAmplitudeEvent(
    event: AmplitudeTaxonomyEvents,
    extraData: Record<string, unknown> | undefined,
): {
    event_type: string
    event_properties: Record<string, string | boolean | number>
} {
    const properties = { ...('data' in event ? event.data : {}), ...extraData }

    return {
        event_type: event.eventName,
        event_properties: properties,
    }
}

export function useLogAmplitudeEvent(
    event: AmplitudeTaxonomyEvents,
    extraData?: Record<string, unknown>,
    condition: () => boolean = () => true,
): void {
    const stableEvent = useRef(event)
    const stableExtraData = useRef(extraData)
    const stableCondition = useRef(condition)

    useLayoutEffect(() => {
        if (stableCondition.current()) {
            logAmplitudeEvent(stableEvent.current, stableExtraData.current)
        }
    }, [])
}

export type AmplitudeTaxonomyEvents =
    | { eventName: 'accordion lukket'; data: { tekst: string } }
    | { eventName: 'accordion åpnet'; data: { tekst: string } }
    | { eventName: 'alert vist'; data: { variant: string; tekst: string } }
    | { eventName: 'besøk' }
    | { eventName: 'chat avsluttet'; data: { komponent: string } }
    | { eventName: 'chat startet'; data: { komponent: string } }
    | { eventName: 'last ned'; data: { type: string; tema: string; tittel: string } }
    | { eventName: 'modal lukket'; data: { tekst: string } }
    | { eventName: 'modal åpnet'; data: { tekst: string } }
    | { eventName: 'navigere'; data: { lenketekst: string; destinasjon: string } }
    | { eventName: 'skjema fullført'; data: { skjemanavn: string /* skjemaId: number */ } }
    | { eventName: 'skjema innsending feilet'; data: { skjemanavn: string /* skjemaId: number */ } }
    | {
          eventName: 'skjema spørsmål besvart'
          data: { skjemanavn: string; spørsmål: string; svar: string /* skjemaId: number */ }
      }
    | { eventName: 'skjema startet'; data: { skjemanavn: string /* skjemaId: number */ } }
    | { eventName: 'skjema steg fullført'; data: { skjemanavn: string; steg: string /* skjemaId: number */ } }
    | { eventName: 'skjema validering feilet'; data: { skjemanavn: string /* skjemaId: number */ } }
    | { eventName: 'skjema åpnet'; data: { skjemanavn: string /* skjemaId: number */ } }
    | { eventName: 'guidepanel vist'; data: { komponent: string; tekst?: string } }
    | { eventName: 'filtervalg'; data: { kategori: string; filternavn: string } }
    // Non-standard event
    | { eventName: 'komponent vist'; data: { komponent: string } }
