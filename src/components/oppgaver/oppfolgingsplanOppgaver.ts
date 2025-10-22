import { Godkjenning, Oppfolgingsplan } from '../../types/oppfolgingsplan'
import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { erSykmeldingGyldigForOppfolgingMedGrensedato } from '../../utils/erSykmeldingGyldigForOppfolgingMedGrensedato'
import { tekst } from '../../utils/tekster'

import { Oppgave } from './oppgaveTyper'
import { tallTilSpråk } from './tallTilSpraak'

const erOppfolgingsdialogKnyttetTilGyldigSykmelding = (
    oppfolgingsdialog: Oppfolgingsplan,
    sykmeldinger: DittSykefravaerSykmelding[],
) => {
    const dagensDato = new Date()
    return (
        sykmeldinger.filter((sykmelding) => {
            return (
                oppfolgingsdialog.virksomhet.virksomhetsnummer ===
                    sykmelding.sykmeldingStatus.arbeidsgiver?.orgnummer &&
                erSykmeldingGyldigForOppfolgingMedGrensedato(sykmelding, dagensDato)
            )
        }).length > 0
    )
}

const idAlleredeFunnet = (planer: Oppfolgingsplan[], id: number) => {
    return (
        planer.filter((plan) => {
            return plan.id === id
        }).length > 0
    )
}

const finnNyesteGodkjenning = (godkjenninger: Godkjenning[]) => {
    return godkjenninger.sort((g1, g2) => {
        return new Date(g2.godkjenningsTidspunkt).getTime() - new Date(g1.godkjenningsTidspunkt).getTime()
    })[0]
}

const prosseserPlaner = (oppfolgingsdialoger: Oppfolgingsplan[], sykmeldinger: DittSykefravaerSykmelding[]) => {
    const oppfolgingdialogerKnyttetTilGyldigSykmelding = oppfolgingsdialoger.filter((plan) => {
        return erOppfolgingsdialogKnyttetTilGyldigSykmelding(plan, sykmeldinger)
    })
    const avventendeGodkjenninger = oppfolgingdialogerKnyttetTilGyldigSykmelding.filter((plan) => {
        return (
            plan.godkjenninger.length > 0 &&
            plan.arbeidstaker.fnr !== finnNyesteGodkjenning(plan.godkjenninger).godkjentAv.fnr &&
            finnNyesteGodkjenning(plan.godkjenninger).godkjent
        )
    })
    const nyePlaner = oppfolgingdialogerKnyttetTilGyldigSykmelding.filter((plan) => {
        return (
            plan.arbeidstaker.sistInnlogget === null &&
            plan.status === 'UNDER_ARBEID' &&
            plan.sistEndretAv.fnr !== plan.arbeidstaker.fnr &&
            !idAlleredeFunnet(avventendeGodkjenninger, plan.id)
        )
    })

    return {
        nyePlaner: nyePlaner.length,
        avventendeGodkjenninger: avventendeGodkjenninger.length,
    }
}

export const skapOppfolgingsplanOppgaver = (
    oppfolgingsdialoger: Oppfolgingsplan[] | undefined,
    sykmeldinger: DittSykefravaerSykmelding[] | undefined,
    lenke: string,
): Oppgave[] => {
    if (!oppfolgingsdialoger || !sykmeldinger) {
        return []
    }
    const planer = prosseserPlaner(oppfolgingsdialoger, sykmeldinger)
    const oppgaver: Oppgave[] = []

    function leggTilOppgave(tekst: string) {
        oppgaver.push({
            tekst,
            lenke,
        })
    }

    if (planer.nyePlaner === 1) {
        leggTilOppgave(tekst('oppgaver.oppfoelgingsplan.sykmeldt.nyeplaner.entall'))
    }
    if (planer.nyePlaner > 1) {
        leggTilOppgave(
            tekst('oppgaver.oppfoelgingsplan.sykmeldt.nyeplaner.flertall', {
                '%ANTALL%': tallTilSpråk(planer.nyePlaner),
            }),
        )
    }
    if (planer.avventendeGodkjenninger === 1) {
        leggTilOppgave(tekst('oppgaver.oppfoelgingsplan.avventendegodkjenninger.entall'))
    }
    if (planer.avventendeGodkjenninger > 1) {
        leggTilOppgave(
            tekst('oppgaver.oppfoelgingsplan.avventendegodkjenninger.flertall', {
                '%ANTALL%': tallTilSpråk(planer.avventendeGodkjenninger),
            }),
        )
    }
    return oppgaver
}
