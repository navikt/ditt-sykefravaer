import type { Persona, PersonaData, PersonaKey } from '../../testperson'

import { henterInntektsmeldingFraAaregMedVerdiFor3Maneder, mottattInntektsmelding } from './inntektsmeldingTestPersoner'

function beskjedTestperson(nokkel: PersonaKey, beskrivelse: string, tilpasning: Partial<Persona> = {}): Persona {
    return {
        ...henterInntektsmeldingFraAaregMedVerdiFor3Maneder,
        ...tilpasning,
        beskrivelse,
        startside: `/syk/sykefravaer/beskjed/123456y7?testperson=${nokkel}`,
    }
}

export const beskjedTestpersoner = {
    'beskjed-forelagt-inntekt': beskjedTestperson('beskjed-forelagt-inntekt', 'Beskjed med inntekt fra a-ordningen'),
    'beskjed-vanlig-melding': beskjedTestperson('beskjed-vanlig-melding', 'Vanlig beskjed om mottatt inntektsmelding', {
        meldinger: mottattInntektsmelding.meldinger,
    }),
    'beskjed-mangler': beskjedTestperson('beskjed-mangler', 'Beskjed som mangler i listen', { meldinger: [] }),
    'beskjed-ingen-tilgang': beskjedTestperson('beskjed-ingen-tilgang', 'Ingen tilgang til beskjeden (403)', {
        beskjedDemo: { status: 403 },
    }),
    'beskjed-ikke-funnet': beskjedTestperson('beskjed-ikke-funnet', 'Henting svarer med ikke funnet (404)', {
        beskjedDemo: { status: 404 },
    }),
    'beskjed-teknisk-feil': beskjedTestperson('beskjed-teknisk-feil', 'Teknisk feil ved henting (500)', {
        beskjedDemo: { status: 500 },
    }),
    'beskjed-treg-henting': beskjedTestperson('beskjed-treg-henting', 'Treg henting av beskjed (3 sekunder)', {
        beskjedDemo: { forsinkelseMs: 3000 },
    }),
} satisfies PersonaData
