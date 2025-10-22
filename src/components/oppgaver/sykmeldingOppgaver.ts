import dayjs from 'dayjs'

import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { tekst } from '../../utils/tekster'

import { Oppgave } from './oppgaveTyper'
import { tallTilSpråk } from './tallTilSpraak'

function hentSykmeldingSluttdato(sykmelding: DittSykefravaerSykmelding) {
    if (sykmelding.sykmeldingsperioder.length == 0) {
        return dayjs()
    }
    const tom = sykmelding.sykmeldingsperioder.reduce((acc, value) => {
        if (dayjs(value.fom).isAfter(dayjs(acc.fom))) {
            return value
        }

        return acc
    }).tom
    return dayjs(tom)
}

export const skapSykmeldingoppgaver = (
    sykmeldinger: DittSykefravaerSykmelding[] | undefined,
    sykmeldingUrl: string,
): Oppgave[] => {
    if (!sykmeldinger) {
        return []
    }

    function erGammelSykmelding(sykmelding: DittSykefravaerSykmelding) {
        return hentSykmeldingSluttdato(sykmelding).isBefore(dayjs().subtract(3, 'months'))
    }

    const ikkeGamleSykmeldinger = sykmeldinger.filter((s) => !erGammelSykmelding(s))

    const skapVanligeOppgaver = (sykmeldinger: DittSykefravaerSykmelding[], sykmeldingUrl: string): Oppgave[] => {
        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent === 'APEN')
            .filter((s) => s.behandlingsutfall.status === 'OK' || s.behandlingsutfall.status === 'MANUAL_PROCESSING')

        if (sykmeldingene.length === 0) {
            return []
        }

        if (sykmeldingene.length === 1) {
            return [
                {
                    tekst: tekst('oppgaver.sykmeldinger.en-sykmelding'),
                    lenke: `${sykmeldingUrl}/${sykmeldingene[0].id}`,
                },
            ]
        }

        return [
            {
                tekst: tekst('oppgaver.sykmeldinger.flere-sykmeldinger', {
                    '%ANTALL%': tallTilSpråk(sykmeldingene.length),
                }),
                lenke: sykmeldingUrl,
            },
        ]
    }

    const skapAvvisteOppgaver = (sykmeldinger: DittSykefravaerSykmelding[], sykmeldingUrl: string): Oppgave[] => {
        const sykmeldingene = sykmeldinger
            .filter((s) => s.sykmeldingStatus.statusEvent === 'APEN')
            .filter((s) => s.behandlingsutfall.status === 'INVALID')

        if (sykmeldingene.length === 0) {
            return []
        }

        if (sykmeldingene.length === 1) {
            return [
                {
                    tekst: tekst('oppgaver.sykmeldinger.en-avvist-sykmelding'),
                    lenke: `${sykmeldingUrl}/${sykmeldingene[0].id}`,
                },
            ]
        }

        return [
            {
                tekst: tekst('oppgaver.sykmeldinger.flere-avviste-sykmeldinger', {
                    '%ANTALL%': tallTilSpråk(sykmeldingene.length),
                }),
                lenke: sykmeldingUrl,
            },
        ]
    }

    return [
        ...skapVanligeOppgaver(ikkeGamleSykmeldinger, sykmeldingUrl),
        ...skapAvvisteOppgaver(ikkeGamleSykmeldinger, sykmeldingUrl),
    ]
}
