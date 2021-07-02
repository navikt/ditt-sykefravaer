import { DialogMote, TidOgSted } from '../../types/dialogmote'
import { tekst } from '../../utils/tekster'
import { Oppgave } from './oppgaveTyper'

const erMotePassert = (dialogmote: DialogMote) => {
    if (!dialogmote) return false
    if (dialogmote.bekreftetAlternativ && new Date(dialogmote.bekreftetAlternativ.tid) <= new Date()) return true
    const antallAlternativer = dialogmote.alternativer.length
    return dialogmote.alternativer.filter((alternativ) => {
        return new Date(alternativ.tid) <= new Date()
    }).length === antallAlternativer
}

const brukerHarSvart = (svartidspunkt: string, created: string) => {
    if (!svartidspunkt) return false
    return new Date(svartidspunkt) > new Date(created)
}

const getSvarsideModus = (dialogmote: DialogMote, deltakertype = 'Bruker') => {
    // Ingen dialogmøte:
    if (!dialogmote) return undefined

    // dialogmøte er avbrutt:
    if (dialogmote.status === 'AVBRUTT') return 'AVBRUTT'

    // dialogmøte er bekreftet:
    const ingenUbekreftetDialogmote = dialogmote.alternativer.filter((alternativ: TidOgSted) => {
        return alternativ.created > dialogmote.bekreftetTidspunkt
    }).length === 0
    if (dialogmote.status === 'BEKREFTET' && ingenUbekreftetDialogmote) return 'BEKREFTET'

    // Alle alternativer er besvart:
    const deltaker = dialogmote.deltakere.filter((deltaker) => deltaker.type === deltakertype ? 1 : 0 )[0]
    const alleAlternativerErBesvart = dialogmote.alternativer.filter((alternativ: TidOgSted) => {
        const svar = deltaker.svar.filter( svaretsTidOgSted => svaretsTidOgSted.id === alternativ.id)[0]
        return !brukerHarSvart(deltaker.svartidspunkt, svar.created)
    }).length === 0
    if (alleAlternativerErBesvart) return 'MOTESTATUS'

    // Skjema:
    return 'SKJEMA'
}

export const skapDialogmoteSvarOppgaver = (dialogmoteSvar: DialogMote | undefined, lenke: string) => {
    const oppgaver: Oppgave[] = []
    if (!dialogmoteSvar) return []
    if (dialogmoteSvar && !erMotePassert(dialogmoteSvar)) {
        if (getSvarsideModus(dialogmoteSvar) === 'SKJEMA') {
            oppgaver.push({
                tekst: tekst('oppgaver.dialogmote.svar'),
                oppgavetype: 'info',
                lenke
            })
        }
    }

    return oppgaver
}


