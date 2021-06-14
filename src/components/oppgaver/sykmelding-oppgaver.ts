import { Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgave-typer'
import { tallTilSpråk } from './tall-til-språk'

export function skapSykmeldingoppgaver(sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] {

    function skapVanligeOppgaver(sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] {

        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent == 'APEN')
            .filter((s) => s.behandlingsutfall.status == 'OK' || s.behandlingsutfall.status == 'MANUAL_PROCESSING')

        if (sykmeldingene.length == 0) {
            return []
        }

        if (sykmeldingene.length == 1) {
            return [ {
                tekst: tekst('oppgaver.sykmeldinger.en-sykmelding'),
                lenke: `${sykmeldingUrl}/soknader/${sykmeldingene[ 0 ].id}`,
                type: 'info'
            } ]
        }
        return [ {
            tekst: tekst('oppgaver.sykmeldinger.flere-sykmeldinger', {
                '%ANTALL%': tallTilSpråk(sykmeldingene.length),
            }),
            lenke: sykmeldingUrl,
            type: 'info',

        } ]
    }

    function skapAvvisteOppgaver(sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] {
        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent == 'APEN')
            .filter((s) => s.behandlingsutfall.status == 'INVALID')

        if (sykmeldingene.length == 0) {
            return []
        }

        if (sykmeldingene.length == 1) {
            return [ {
                tekst: tekst('oppgaver.sykmeldinger.en-avvist-sykmelding'),
                lenke: `${sykmeldingUrl}/soknader/${sykmeldingene[ 0 ].id}`,
                type: 'advarsel',

            } ]
        }
        return [ {
            tekst: tekst('oppgaver.sykmeldinger.flere-avviste-sykmeldinger', {
                '%ANTALL%': tallTilSpråk(sykmeldingene.length),
            }),
            lenke: sykmeldingUrl,
            type: 'advarsel',
        } ]
    }

    return [ ...skapVanligeOppgaver(sykmeldinger, sykmeldingUrl), ...skapAvvisteOppgaver(sykmeldinger, sykmeldingUrl) ]

}
