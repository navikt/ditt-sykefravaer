import { expect, it } from 'vitest'

import { avventendeUnderArbeid, nyUnderArbeid } from '../../data/mock/data/oppfolgingsplaner'
import { sendtSykmelding } from '../../data/mock/data/sykmeldinger'

import { skapOppfolgingsplanOppgaver } from './oppfolgingsplanOppgaver'

const legacyUrl = 'http://example.com/oppfolgingsplaner/sykmeldt'

it('returnerer en legacy-oppgave for nye planer med gammel url', () => {
    const oppgaver = skapOppfolgingsplanOppgaver([{ ...nyUnderArbeid }], [{ ...sendtSykmelding }], legacyUrl)

    expect(oppgaver).toEqual([
        {
            lenke: legacyUrl,
            tekst: 'Arbeidsgiveren din har begynt på en oppfølgingsplan. Du skal fylle ut din del.',
        },
    ])
})

it('returnerer en legacy-oppgave for avventende godkjenning med gammel url', () => {
    const oppgaver = skapOppfolgingsplanOppgaver(
        [
            {
                ...avventendeUnderArbeid,
                godkjenninger: [...avventendeUnderArbeid.godkjenninger],
            },
        ],
        [{ ...sendtSykmelding }],
        legacyUrl,
    )

    expect(oppgaver).toEqual([
        {
            lenke: legacyUrl,
            tekst: 'Du har en oppfølgingsplan som venter på godkjenning av deg',
        },
    ])
})
