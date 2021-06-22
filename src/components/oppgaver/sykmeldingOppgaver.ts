import { Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'
import { tallTilSpråk } from './tallTilSpraak'

export const skapSykmeldingoppgaver = (sykmeldinger: Sykmelding[] | undefined, sykmeldingUrl: string): Oppgave[] => {
    if (!sykmeldinger) {
        return []
    }
    const skapVanligeOppgaver = (sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] => {
        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent === 'APEN')
            .filter((s) =>
                s.behandlingsutfall.status === 'OK' ||
                s.behandlingsutfall.status === 'MANUAL_PROCESSING'
            )

        if (sykmeldingene.length === 0) {
            return []
        }

        if (sykmeldingene.length === 1) {
            return [ {
                tekst: tekst('oppgaver.sykmeldinger.en-sykmelding'),
                lenke: `${sykmeldingUrl}/${sykmeldingene[ 0 ].id}`,
                oppgavetype: 'info'
            } ]
        }

        return [ {
            tekst: tekst('oppgaver.sykmeldinger.flere-sykmeldinger', {
                '%ANTALL%': tallTilSpråk(sykmeldingene.length),
            }),
            lenke: sykmeldingUrl,
            oppgavetype: 'info',

        } ]
    }

    const skapAvvisteOppgaver = (sykmeldinger: Sykmelding[], sykmeldingUrl: string): Oppgave[] => {
        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent === 'APEN')
            .filter((s) => s.behandlingsutfall.status === 'INVALID')

        if (sykmeldingene.length === 0) {
            return []
        }

        if (sykmeldingene.length === 1) {
            return [ {
                tekst: tekst('oppgaver.sykmeldinger.en-avvist-sykmelding'),
                lenke: `${sykmeldingUrl}/${sykmeldingene[ 0 ].id}`,
                oppgavetype: 'advarsel',

            } ]
        }

        return [ {
            tekst: tekst('oppgaver.sykmeldinger.flere-avviste-sykmeldinger', {
                '%ANTALL%': tallTilSpråk(sykmeldingene.length),
            }),
            lenke: sykmeldingUrl,
            oppgavetype: 'advarsel',
        } ]
    }

    return [
        ...skapVanligeOppgaver(sykmeldinger, sykmeldingUrl),
        ...skapAvvisteOppgaver(sykmeldinger, sykmeldingUrl)
    ]
}
