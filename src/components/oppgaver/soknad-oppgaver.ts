import { RSSoknadstatus } from '../../types/rs-types/rs-soknadstatus'
import { RSSoknadstype } from '../../types/rs-types/rs-soknadstype'
import { Soknad } from '../../types/soknad'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgave-typer'
import { tallTilSpråk } from './tall-til-språk'

export function skapSøknadOppgaver(soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] {

    const søknaderTilUtfylling = (s: Soknad) => (s.status == RSSoknadstatus.NY || s.status == RSSoknadstatus.UTKAST_TIL_KORRIGERING)

    function skapSykepengesoknadOppgaver(soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] {
        const vanligeSoknader = [ RSSoknadstype.ARBEIDSTAKERE, RSSoknadstype.ARBEIDSLEDIG, RSSoknadstype.ANNET_ARBEIDSFORHOLD, RSSoknadstype.BEHANDLINGSDAGER, RSSoknadstype.SELVSTENDIGE_OG_FRILANSERE, ]

        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => vanligeSoknader.includes(s.soknadstype))

        if (soknadene.length === 0) {
            return []
        }

        if (soknadene.length === 1) {
            return [ {
                tekst: tekst('oppgaver.sykepengesoknad.enkel'),
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[0].id}`,
                oppgavetype: 'info'
            } ]
        }

        return [ {
            tekst: tekst('oppgaver.sykepengesoknad.flere', {
                '%ANTALL%': tallTilSpråk(soknadene.length),
            }),
            lenke: sykepengesoknadUrl,
            oppgavetype: 'info'
        } ]
    }

    function skapReisetilskuddOppgaver(soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] {
        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => s.soknadstype == RSSoknadstype.REISETILSKUDD)

        if (soknadene.length == 0) {
            return []
        }

        if (soknadene.length == 1) {
            return [ {
                tekst: tekst('oppgaver.reisetilskudd.enkel'),
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[0].id}`,
                oppgavetype: 'info'
            } ]
        }

        return [ {
            tekst: tekst('oppgaver.reisetilskudd.flere', {
                '%ANTALL%': tallTilSpråk(soknadene.length),
            }),
            lenke: sykepengesoknadUrl,
            oppgavetype: 'info'
        } ]
    }

    return [
        ...skapSykepengesoknadOppgaver(soknader, sykepengesoknadUrl),
        ...skapReisetilskuddOppgaver(soknader, sykepengesoknadUrl)
    ]
}
