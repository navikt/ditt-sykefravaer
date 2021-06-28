import dayjs from 'dayjs'

import { Sykeforloep } from '../../types/sykeforloep'
import { Sykmelding } from '../../types/sykmelding'
import { getSykefravaerVarighet, hentStartdatoFraSykeforloep, skalViseUtdrag } from './tidslinjeUtdragHjelefunksjoner'

describe('Tidslinjeutdrag hjelpefunksjoner', () => {
    const iDag = dayjs()

    const passertSykmelding = (): Sykmelding => {
        return {
            id: 'passert',
            behandlingsutfall: { status: 'OK' },
            sykmeldingStatus: {
                statusEvent: 'SENDT',
            },
            sykmeldingsperioder: [ {
                fom: iDag.subtract(11, 'days').format('YYYY-MM-DD'),
                tom: iDag.subtract(7, 'days').format('YYYY-MM-DD'),
            } ],
            syketilfelleStartDato: iDag.subtract(20, 'days').format('YYYY-MM-DD'),
        }
    }

    const aktivSykmelding = (): Sykmelding => {
        return {
            id: 'aktiv',
            behandlingsutfall: { status: 'OK' },
            sykmeldingStatus: {
                statusEvent: 'SENDT',
            },
            sykmeldingsperioder: [ {
                fom: iDag.subtract(11, 'days').format('YYYY-MM-DD'),
                tom: iDag.add(2, 'days').format('YYYY-MM-DD'),
            } ],
            syketilfelleStartDato: iDag.subtract(20, 'days').format('YYYY-MM-DD'),
        }
    }

    it('Skal ikke vise noe dersom bruker ikke har sykmeldinger', () => {
        expect(skalViseUtdrag(undefined)).toEqual(false)
        expect(skalViseUtdrag([])).toEqual(false)
    })

    it('Skal ikke vise noe dersom siste sykmeldings tom-dato er passert med 7 dager', () => {
        expect(skalViseUtdrag([ passertSykmelding() ])).toEqual(false)
    })

    it('Skal ikke vise noe dersom siste sykmeldings tom-dato ikke er passert, men sykmeldingen er avbrutt', () => {
        const avbruttSykmelding = aktivSykmelding()
        avbruttSykmelding.sykmeldingStatus.statusEvent = 'AVBRUTT'
        expect(skalViseUtdrag([ passertSykmelding(), avbruttSykmelding ])).toEqual(false)
    })

    it('Skal vise noe dersom siste sykmeldings tom-dato ikke er passert', () => {
        expect(skalViseUtdrag([ passertSykmelding(), aktivSykmelding() ])).toEqual(true)
    })

    it('Skal beregne antallDager', () => {
        const sykeforloepIDag: Sykeforloep[] = [ { oppfolgingsdato: iDag.format('YYYY-MM-DD'), sykmeldinger: [] } ]
        expect(getSykefravaerVarighet(sykeforloepIDag, [])).toEqual(1)

        const sykeforloepFraForrigeDag: Sykeforloep[] = [ { oppfolgingsdato: iDag.subtract(1, 'day').format('YYYY-MM-DD'), sykmeldinger: [] } ]
        expect(getSykefravaerVarighet(sykeforloepFraForrigeDag, [])).toEqual(2)

        const sykeforloepToUker: Sykeforloep[] = [ { oppfolgingsdato: iDag.subtract(13, 'days').format('YYYY-MM-DD'), sykmeldinger: [] } ]
        expect(getSykefravaerVarighet(sykeforloepToUker, [])).toEqual(14)
    })

    it('Skal tvinge varighet til 275 dager hvis det er mindre enn 13 uker igjen til maksdato', () => {
        const merEnnTrettiniUker = (39 * 7) + 7

        const sykmelding = aktivSykmelding()
        sykmelding.syketilfelleStartDato = iDag.subtract(merEnnTrettiniUker, 'days').format('YYYY-MM-DD')
        sykmelding.sykmeldingsperioder[0].fom = iDag.subtract(merEnnTrettiniUker, 'days').format('YYYY-MM-DD')
        sykmelding.sykmeldingsperioder[0].tom = iDag.format('YYYY-MM-DD')

        const sykeforloep: Sykeforloep[] = [ {
            oppfolgingsdato: sykmelding.syketilfelleStartDato,
            sykmeldinger: [
                { fom: sykmelding.sykmeldingsperioder[0].fom, tom: sykmelding.sykmeldingsperioder[0].tom },
            ]
        } ]

        expect(merEnnTrettiniUker).toBeGreaterThan(273)
        expect(getSykefravaerVarighet(sykeforloep, [ sykmelding ])).toEqual(275)
    })

    it('Skal tvinge varighet til 272 når arbeidsrettet oppfølging er deaktivert, selv om beregning fra sykeforløp returnerer > 39 uker', () => {
        const merEnnTrettiniUker = (39 * 7) + 7

        const sykmelding = aktivSykmelding()
        sykmelding.syketilfelleStartDato = iDag.subtract(merEnnTrettiniUker, 'days').format('YYYY-MM-DD')
        sykmelding.sykmeldingsperioder[0].fom = iDag.subtract(merEnnTrettiniUker, 'days').format('YYYY-MM-DD')
        sykmelding.sykmeldingsperioder[0].tom = iDag.format('YYYY-MM-DD')

        const nySykmelding = aktivSykmelding()
        nySykmelding.sykmeldingStatus.statusEvent = 'APEN'

        const sykeforloep: Sykeforloep[] = [ {
            oppfolgingsdato: sykmelding.syketilfelleStartDato,
            sykmeldinger: [
                { fom: sykmelding.sykmeldingsperioder[0].fom, tom: sykmelding.sykmeldingsperioder[0].tom },
                { fom: nySykmelding.sykmeldingsperioder[0].fom, tom: nySykmelding.sykmeldingsperioder[0].tom },
            ]
        } ]

        expect(merEnnTrettiniUker).toBeGreaterThan(273)
        expect(getSykefravaerVarighet(sykeforloep, [ sykmelding, nySykmelding ])).toEqual(272)
    })

    it('Skal beregne varighet fra sykeforløp når arbeidsrettet oppfølging er deaktivert og beregning fra sykeforløp returnerer < 39 uker', () => {
        const mindreEnnTrettiniUker = (39 * 7) - 7

        const sykmelding = aktivSykmelding()
        sykmelding.syketilfelleStartDato = iDag.subtract(mindreEnnTrettiniUker, 'days').format('YYYY-MM-DD')
        sykmelding.sykmeldingsperioder[0].fom = iDag.subtract(mindreEnnTrettiniUker, 'days').format('YYYY-MM-DD')
        sykmelding.sykmeldingsperioder[0].tom = iDag.format('YYYY-MM-DD')

        const nySykmelding = aktivSykmelding()
        nySykmelding.sykmeldingStatus.statusEvent = 'APEN'

        const sykeforloep: Sykeforloep[] = [ {
            oppfolgingsdato: sykmelding.syketilfelleStartDato,
            sykmeldinger: [
                { fom: sykmelding.sykmeldingsperioder[0].fom, tom: sykmelding.sykmeldingsperioder[0].tom },
                { fom: nySykmelding.sykmeldingsperioder[0].fom, tom: nySykmelding.sykmeldingsperioder[0].tom },
            ]
        } ]

        expect(mindreEnnTrettiniUker).toBeLessThan(274)
        expect(getSykefravaerVarighet(sykeforloep, [ sykmelding, nySykmelding ])).toEqual(267)
    })

    it('Nyeste sykeforloep velges', () => {
        const sykeforloep: Sykeforloep[] = [
            {
                oppfolgingsdato: iDag.format('YYYY-MM-DD'),
                sykmeldinger: [],
            },
            {
                oppfolgingsdato: iDag.subtract(10, 'days').format('YYYY-MM-DD'),
                sykmeldinger: [],
            },
        ]
        expect(hentStartdatoFraSykeforloep(sykeforloep)).toEqual(iDag.startOf('day'))
        expect(hentStartdatoFraSykeforloep(sykeforloep.reverse())).toEqual(iDag.startOf('day'))
    })
})
