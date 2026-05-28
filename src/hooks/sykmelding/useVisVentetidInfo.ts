import { ArbeidssituasjonType } from '../../types/sykmelding/sykmeldingCommon'

import useErUtenforVentetid from './useErUtenforVentetid'

export function useVisVentetidInfo(sykmeldingId: string, arbeidssituasjon: ArbeidssituasjonType | undefined): boolean {
    const erNaeringsdrivendeEllerFrilanser =
        arbeidssituasjon === ArbeidssituasjonType.NAERINGSDRIVENDE ||
        arbeidssituasjon === ArbeidssituasjonType.FRILANSER

    const { data } = useErUtenforVentetid(sykmeldingId, erNaeringsdrivendeEllerFrilanser)

    return erNaeringsdrivendeEllerFrilanser && data?.erUtenforVentetid === false
}
