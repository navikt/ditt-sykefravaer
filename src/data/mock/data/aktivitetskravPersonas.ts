import { aktivitetskravBekreftet, aktivitetskravVarsel } from './aktivitetsplikt'
import { enTomDialogmote } from './dialogmoter'
import { Persona } from './persona'

export const etAktivitetskravVarsel = (): Persona => {
    return {
        soknader: [],
        vedtak: [],
        oppfolgingsplaner: [],
        dialogmote: enTomDialogmote,
        dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
        sykmeldinger: [],
        narmesteledere: [],
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { underOppfolging: false },
        sykeforloep: [],
        hendelser: [ aktivitetskravVarsel ],
    }
}

export const etAktivitetskravBekreftet = (): Persona => {
    return {
        soknader: [],
        vedtak: [],
        oppfolgingsplaner: [],
        dialogmote: enTomDialogmote,
        dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
        sykmeldinger: [],
        narmesteledere: [],
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { underOppfolging: false },
        sykeforloep: [],
        hendelser: [ aktivitetskravVarsel, aktivitetskravBekreftet, aktivitetskravBekreftet ],
    }
}
