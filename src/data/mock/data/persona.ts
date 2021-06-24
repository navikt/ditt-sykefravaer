import { ArbeidsrettetOppfolging } from '../../../types/arbeidsrettetOppfolging'
import { NarmesteLeder } from '../../../types/narmesteLeder'
import { Oppfolgingsplan } from '../../../types/oppfolgingsplan'
import { Soknad } from '../../../types/soknad'
import { Sykeforloep } from '../../../types/sykeforloep'
import { Sykmelding } from '../../../types/sykmelding'
import { RSVedtakWrapper } from '../../../types/vedtak'


export interface Persona {
    soknader: Soknad[],
    vedtak: RSVedtakWrapper[],
    sykmeldinger: Sykmelding[],
    narmesteledere: NarmesteLeder[],
    snartSluttSykepenger: boolean,
    arbeidsrettetOppfolging: ArbeidsrettetOppfolging,
    oppfolgingsplaner: Oppfolgingsplan[],
    dialogmote: { status: string },
    dialogmoteBehov: { visMotebehov: boolean },
    sykeforloep: Sykeforloep[],
}

