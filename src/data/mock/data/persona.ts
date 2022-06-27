import { ArbeidsrettetOppfolging } from '../../../types/arbeidsrettetOppfolging'
import { Brev } from '../../../types/brev'
import { DialogmoteBehov } from '../../../types/dialogmoteBehov'
import { Melding } from '../../../types/melding'
import { NarmesteLeder } from '../../../types/narmesteLeder'
import { Oppfolgingsplan } from '../../../types/oppfolgingsplan'
import { Soknad } from '../../../types/soknad'
import { Sykmelding } from '../../../types/sykmelding'
import { RSVedtakWrapper } from '../../../types/vedtak'

export interface Persona {
    soknader: Soknad[]
    vedtak: RSVedtakWrapper[]
    sykmeldinger: Sykmelding[]
    narmesteledere: NarmesteLeder[]
    snartSluttSykepenger: boolean
    arbeidsrettetOppfolging: ArbeidsrettetOppfolging
    oppfolgingsplaner: Oppfolgingsplan[]
    dialogmoteBehov: DialogmoteBehov
    brev: Brev[]
    meldinger: Melding[]
}
