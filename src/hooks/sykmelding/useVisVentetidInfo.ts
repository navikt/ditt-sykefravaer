import { ArbeidssituasjonType } from '../../types/sykmelding/sykmeldingCommon'

import useVentetid from './useVentetid'

export function useVisVentetidInfo(sykmeldingId: string, arbeidssituasjon: ArbeidssituasjonType | undefined): boolean {
    const erNaeringsdrivendeEllerFrilanser =
        arbeidssituasjon === ArbeidssituasjonType.NAERINGSDRIVENDE ||
        arbeidssituasjon === ArbeidssituasjonType.FRILANSER

    const { data } = useVentetid(sykmeldingId, arbeidssituasjon, erNaeringsdrivendeEllerFrilanser)

    return erNaeringsdrivendeEllerFrilanser && data?.erUtenforVentetid === false
}
