import dayjs from 'dayjs'

import { Persona } from '../../testperson'
import { sendtSykmelding } from '../sykmeldinger'
import { jsonDeepCopy } from '../../../../utils/jsonDeepCopy'

import { commonPersona } from './personas'

export function skapSendtSykmelding(tom: dayjs.Dayjs) {
    const sm = jsonDeepCopy(sendtSykmelding)
    sm.sykmeldingsperioder[0].tom = tom.format('YYYY-MM-DD')
    return sm
}

export const sykNåMedMaksdato: Persona = {
    ...commonPersona(),
    sykmeldinger: [skapSendtSykmelding(dayjs())],
    maxdato: {
        maxDate: dayjs().add(340, 'days').format('YYYY-MM-DD'),
        utbetaltTom: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
    },
    beskrivelse: 'Syk nå med maksdato langt frem i tid',
}
export const sykNåMedMaksdato60gammel: Persona = {
    ...commonPersona(),
    sykmeldinger: [skapSendtSykmelding(dayjs())],
    maxdato: {
        maxDate: dayjs().add(290, 'days').format('YYYY-MM-DD'),
        utbetaltTom: dayjs().subtract(60, 'days').format('YYYY-MM-DD'),
    },
    beskrivelse: 'Syk nå med maksdato beregnet for 60 dager siden',
}

export const sykNåMedMaksdato59gammel: Persona = {
    ...commonPersona(),
    sykmeldinger: [skapSendtSykmelding(dayjs())],
    maxdato: {
        maxDate: dayjs().add(290, 'days').format('YYYY-MM-DD'),
        utbetaltTom: dayjs().subtract(59, 'days').format('YYYY-MM-DD'),
    },
    beskrivelse: 'Syk nå med maksdato beregnet for 59 dager siden',
}

export const syk16sidenMedMaksdato: Persona = {
    ...commonPersona(),
    sykmeldinger: [skapSendtSykmelding(dayjs().subtract(16, 'days'))],
    maxdato: {
        maxDate: dayjs().add(340, 'days').format('YYYY-MM-DD'),
        utbetaltTom: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
    },
    beskrivelse: 'Syk for 16 dager siden med maksdato langt frem i tid',
}

export const syk17sidenMedMaksdato: Persona = {
    ...commonPersona(),
    sykmeldinger: [skapSendtSykmelding(dayjs().subtract(17, 'days'))],
    maxdato: {
        maxDate: dayjs().add(340, 'days').format('YYYY-MM-DD'),
        utbetaltTom: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
    },
    beskrivelse: 'Syk for 17 dager siden med maksdato langt frem i tid',
}
