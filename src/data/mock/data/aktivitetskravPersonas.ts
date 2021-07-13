import {
    aktivitetskravBekreftet,
    aktivitetskravBekreftetMenIkkeNyest,
    aktivitetskravVarsel
} from './aktivitetsplikt'
import { enTomDialogmote } from './dialogmoter'
import { Persona } from './persona'
import { arbeidstaker100Sendt } from './soknader'
import { sendtSykmelding } from './sykmeldinger'

export const etAktivitetskravVarsel = (): Persona => {
    return {
        soknader: [ arbeidstaker100Sendt ],
        vedtak: [],
        oppfolgingsplaner: [],
        dialogmote: enTomDialogmote,
        dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
        sykmeldinger: [ sendtSykmelding ],
        narmesteledere: [],
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { underOppfolging: false },
        sykeforloep: [],
        hendelser: [ aktivitetskravVarsel ],
    }
}

export const toAktivitetskravBekreftet = (): Persona => {
    return {
        soknader: [ arbeidstaker100Sendt ],
        vedtak: [],
        oppfolgingsplaner: [],
        dialogmote: enTomDialogmote,
        dialogmoteBehov: { visMotebehov: false, skjemaType: null, harMotebehov: false },
        sykmeldinger: [ sendtSykmelding ],
        narmesteledere: [],
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { underOppfolging: false },
        sykeforloep: [],
        hendelser: [
            aktivitetskravVarsel,
            aktivitetskravBekreftetMenIkkeNyest,
            aktivitetskravBekreftet
        ],
    }
}
