import { Arbeidsgiver } from '../types/sykmelding/brukerinformasjon'
import { TidligereArbeidsgiver } from '../types/sykmelding/tidligereArbeidsgiver'

import { prettifyOrgName } from './orgUtils'

export function findValgtArbeidsgiver(
    arbeidsgivere: readonly Arbeidsgiver[],
    orgnummer: string | null,
): Arbeidsgiver | undefined {
    return arbeidsgivere.find((arbeidsgiver) => arbeidsgiver.orgnummer === orgnummer)
}

export function deduplisterteArbeidsgivere(tidligereArbeidsgivere: TidligereArbeidsgiver[]): TidligereArbeidsgiver[] {
    const seen = new Set()
    return tidligereArbeidsgivere
        .map((arbeidsgiver) => ({
            orgNavn: prettifyOrgName(arbeidsgiver.orgNavn),
            orgnummer: arbeidsgiver.orgnummer,
        }))
        .filter(({ orgNavn, orgnummer }) => {
            const key = `${orgNavn}-${orgnummer}`
            if (seen.has(key)) return false
            seen.add(key)
            return true
        })
}
