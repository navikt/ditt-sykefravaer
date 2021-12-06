import {
    aktivitetskravBekreftet,
    aktivitetskravBekreftetMenIkkeNyest,
    aktivitetskravVarsel
} from './aktivitetsplikt'
import { brev } from './brev'
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
        dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
        sykmeldinger: [ sendtSykmelding ],
        narmesteledere: [],
        snartSluttSykepenger: false,
        arbeidsrettetOppfolging: { underOppfolging: false },
        sykeforloep: [],
        hendelser: [ aktivitetskravVarsel ],
        brev:brev,
    }
}

export const toAktivitetskravBekreftet = (): Persona => {
    return {
        soknader: [ arbeidstaker100Sendt ],
        vedtak: [],
        oppfolgingsplaner: [],
        dialogmote: enTomDialogmote,
        dialogmoteBehov: { visMotebehov: false, skjemaType: null, motebehov: null },
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
        brev:brev,
    }
}
