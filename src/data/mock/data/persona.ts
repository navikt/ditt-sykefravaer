import { ArbeidsrettetOppfolging } from '../../../types/arbeidsrettetOppfolging'
import { Brev } from '../../../types/brev'
import { DialogMote } from '../../../types/dialogmote'
import { DialogmoteBehov } from '../../../types/dialogmoteBehov'
import { SimpleHendelse } from '../../../types/hendelse'
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
    dialogmote: DialogMote,
    dialogmoteBehov: DialogmoteBehov,
    sykeforloep: Sykeforloep[],
    hendelser: SimpleHendelse[],
    brev: Brev[],
}

