import { expect, it } from 'vitest'
import dayjs from 'dayjs'

import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'

import { skapSykmeldingoppgaver } from './sykmeldingOppgaver'

const iDag = dayjs().format('MM-DD-YYYY')
const iGår = dayjs().subtract(1, 'day').format('MM-DD-YYYY')

it('Returnerer ingen oppgaver når det ikke er noen sykmeldinger', () => {
    const oppgaver = skapSykmeldingoppgaver([], 'http://sykmelding')
    expect(oppgaver).toEqual([])
})

it('Returnerer en oppgave når det er en åpen OK sykmelding', () => {
    const sykmeldinger: DittSykefravaerSykmelding[] = [
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'OK',
            },
        },
    ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://sykmelding/123',
            tekst: 'Du har en ny sykmelding',
        },
    ])
})

it('Returnerer en oppgave når det er en åpen manuell sykmelding', () => {
    const sykmeldinger: DittSykefravaerSykmelding[] = [
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'MANUAL_PROCESSING',
            },
        },
    ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://sykmelding/123',
            tekst: 'Du har en ny sykmelding',
        },
    ])
})

it('Returnerer en oppgave når det er en åpen manuell sykmelding og en åpen ok', () => {
    const sykmeldinger: DittSykefravaerSykmelding[] = [
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'MANUAL_PROCESSING',
            },
        },
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'OK',
            },
        },
    ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://sykmelding',
            tekst: 'Du har to nye sykmeldinger',
        },
    ])
})

it('Returnerer ingen oppgaver når det er en sendt ok sykmelding', () => {
    const sykmeldinger: DittSykefravaerSykmelding[] = [
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'SENDT',
            },
            behandlingsutfall: {
                status: 'OK',
            },
        },
    ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([])
})

it('Returnerer en oppgave når det er en åpen invalid sykmelding', () => {
    const sykmeldinger: DittSykefravaerSykmelding[] = [
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'INVALID',
            },
        },
    ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://sykmelding/123',
            tekst: 'Du har en avvist sykmelding',
        },
    ])
})

it('Returnerer to oppgaver når det er en åpen invalid sykmelding og en åpen ok', () => {
    const sykmeldinger: DittSykefravaerSykmelding[] = [
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'INVALID',
            },
        },
        {
            id: '12345',
            sykmeldingsperioder: [
                {
                    fom: iGår,
                    tom: iDag,
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'OK',
            },
        },
    ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([
        {
            lenke: 'http://sykmelding/12345',
            tekst: 'Du har en ny sykmelding',
        },
        {
            lenke: 'http://sykmelding/123',
            tekst: 'Du har en avvist sykmelding',
        },
    ])
})

it('Returnerer ingen oppgaver når sykmeldingen er eldre enn 3 måneder', () => {
    const sykmeldinger: DittSykefravaerSykmelding[] = [
        {
            id: '123',
            sykmeldingsperioder: [
                {
                    fom: dayjs().subtract(3, 'months').format('MM-DD-YYYY'),
                    tom: dayjs().subtract(3, 'months').format('MM-DD-YYYY'),
                },
            ],
            sykmeldingStatus: {
                statusEvent: 'APEN',
            },
            behandlingsutfall: {
                status: 'OK',
            },
        },
    ]
    const oppgaver = skapSykmeldingoppgaver(sykmeldinger, 'http://sykmelding')
    expect(oppgaver).toEqual([])
})
