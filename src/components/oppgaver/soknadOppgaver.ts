import { Soknad } from '../../types/soknad'
import { Soknadstype } from '../../types/soknadstype'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'
import { tallTilSpråk } from './tallTilSpraak'


export const skapSøknadOppgaver = (soknader: Soknad[] | undefined, sykepengesoknadUrl: string): Oppgave[] => {
    if (!soknader) {
        return []
    }
    const søknaderTilUtfylling = (s: Soknad) =>
        s.status === 'NY' ||
        s.status === 'UTKAST_TIL_KORRIGERING'

    const skapSykepengesoknadOppgaver = (soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] => {
        const vanligeSoknader: Soknadstype[] = [
            'ARBEIDSTAKERE',
            'ARBEIDSLEDIG',
            'ANNET_ARBEIDSFORHOLD',
            'BEHANDLINGSDAGER',
            'SELVSTENDIGE_OG_FRILANSERE',
        ]

        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => vanligeSoknader.includes(s.soknadstype))

        if (soknadene.length === 0) {
            return []
        }

        if (soknadene.length === 1) {
            return [ {
                tekst: tekst('oppgaver.sykepengesoknad.enkel'),
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[ 0 ].id}`,
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

    const skapReisetilskuddOppgaver = (soknader: Soknad[], sykepengesoknadUrl: string): Oppgave[] => {
        const soknadene = soknader
            .filter(søknaderTilUtfylling)
            .filter((s) => s.soknadstype === 'REISETILSKUDD')

        if (soknadene.length === 0) {
            return []
        }

        if (soknadene.length === 1) {
            return [ {
                tekst: tekst('oppgaver.reisetilskudd.enkel'),
                lenke: `${sykepengesoknadUrl}/soknader/${soknadene[ 0 ].id}`,
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
