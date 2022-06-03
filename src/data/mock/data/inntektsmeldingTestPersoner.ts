import dayjs from 'dayjs'

import { commonPersona } from './personas'
import { sendtSykmelding } from './sykmeldinger'

const iDag = dayjs()

export const manglerInntektsmelding = () => {
    const person = commonPersona()
    person.meldinger = [
        {
            uuid: '123456y7',
            tekst: 'Vi mangler inntektsmeldingen fra Test Arbeidsgiver AS',
            lenke: 'http://localhost:8080/syk/sykefravaer/inntektsmelding',
            variant: 'info',
            lukkbar: true,
            opprettet: iDag.format(),
        },
    ]
    person.sykmeldinger = [sendtSykmelding]
    return person
}

export const mottattInntektsmelding = () => {
    const person = commonPersona()
    person.meldinger = [
        {
            uuid: '123456y7',
            tekst: 'Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefravær f.o.m 15. mars 2022.',
            variant: 'success',
            lukkbar: true,
            opprettet: iDag.format(),
        },
    ]
    person.sykmeldinger = [sendtSykmelding]
    return person
}
