import { Arbeidsgiver } from 'src/fetching/graphql.generated'

export function findValgtArbeidsgiver(
    arbeidsgivere: readonly Arbeidsgiver[],
    orgnummer: string | null,
): Arbeidsgiver | undefined {
    return arbeidsgivere.find((arbeidsgiver) => arbeidsgiver.orgnummer === orgnummer)
}
