import { Soknad } from '../../types/soknad'
import { Soknadstype } from '../../types/soknadstype'
import { tekst, TekstKeys } from '../../utils/tekster'

import { Oppgave } from './oppgaveTyper'
import { tallTilSpråk } from './tallTilSpraak'

// Hjelpefunksjon for å filtrere søknader som er nye eller utkast til korrigering
const soknaderTilUtfylling = (s: Soknad) => s.status === 'NY' || s.status === 'UTKAST_TIL_KORRIGERING'

// Generell hjelpefunksjon for å lage oppgaver for en gitt liste av søknadstyper
const skapOppgaverForTyper = (
    soknader: Soknad[],
    soknadstyper: Soknadstype[],
    tekstEnkel: TekstKeys,
    tekstFlere: TekstKeys,
    url: string,
) => {
    const soknadene = soknader.filter(soknaderTilUtfylling).filter((s) => soknadstyper.includes(s.soknadstype))

    if (soknadene.length === 0) return []

    const erOppholdUtland = soknadstyper.includes('OPPHOLD_UTLAND')
    const lenke = erOppholdUtland
        ? `${url}/sykepengesoknad-utland`
        : soknadene.length === 1
          ? `${url}/soknader/${soknadene[0].id}`
          : url

    const tekstObj =
        soknadene.length === 1
            ? { tekst: tekst(tekstEnkel), lenke: lenke }
            : { tekst: tekst(tekstFlere, { '%ANTALL%': tallTilSpråk(soknadene.length) }), lenke: lenke }

    return [tekstObj]
}

// Hovedfunksjon for å lage oppgaver basert på forskjellige søknadstyper
export const skapSoknadOppgaver = (soknader: Soknad[] | undefined, sykepengesoknadUrl: string): Oppgave[] => {
    if (!soknader) return []

    const vanligeSoknadsTyper: Soknadstype[] = [
        'ARBEIDSTAKERE',
        'ARBEIDSLEDIG',
        'ANNET_ARBEIDSFORHOLD',
        'BEHANDLINGSDAGER',
        'SELVSTENDIGE_OG_FRILANSERE',
    ]

    return [
        ...skapOppgaverForTyper(
            soknader,
            vanligeSoknadsTyper,
            'oppgaver.sykepengesoknad.enkel',
            'oppgaver.sykepengesoknad.flere',
            sykepengesoknadUrl,
        ),
        ...skapOppgaverForTyper(
            soknader,
            ['REISETILSKUDD'],
            'oppgaver.reisetilskudd.enkel',
            'oppgaver.reisetilskudd.flere',
            sykepengesoknadUrl,
        ),
        ...skapOppgaverForTyper(
            soknader,
            ['GRADERT_REISETILSKUDD'],
            'oppgaver.gradert-reisetilskudd.enkel',
            'oppgaver.gradert-reisetilskudd.flere',
            sykepengesoknadUrl,
        ),
        ...skapOppgaverForTyper(
            soknader,
            ['OPPHOLD_UTLAND'],
            'oppgaver.opphold-utland-eos.enkel',
            'oppgaver.opphold-utland-eos.flere',
            sykepengesoknadUrl,
        ),
    ]
}
