import { TidligereArbeidsgivereArray } from '../hooks/sykmelding/useTidligereArbeidsgivereById'
import { Arbeidsgiver } from '../hooks/sykmelding/useBrukerinformasjonById'

import { prettifyOrgName } from './orgUtils'

export function findValgtArbeidsgiver(
    arbeidsgivere: readonly Arbeidsgiver[],
    orgnummer: string | null,
): Arbeidsgiver | undefined {
    return arbeidsgivere.find((arbeidsgiver) => arbeidsgiver.orgnummer === orgnummer)
}

export function deduplisterteArbeidsgivere(
    tidligereArbeidsgivere: TidligereArbeidsgivereArray,
): TidligereArbeidsgivereArray {
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
