import { commonPersona } from './personas'
import { sendtSykmelding } from './sykmeldinger'

export const manglerInntektsmelding = () => {
    const person = commonPersona()
    person.meldinger = [
        {
            uuid: '123456y7',
            tekst: 'Vi mangler inntektsmeldingen fra Test Arbeidsgiver AS for sykefravær f.o.m. 1. juni 2022.',
            lenke: '/syk/sykefravaer/inntektsmelding',
            variant: 'info',
            meldingType: 'mangler inntektsmelding',
            lukkbar: false,
            opprettet: '2022-06-16T06:52:22.419786Z',
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
            meldingType: 'mottatt inntektsmelding',
            lukkbar: true,
            opprettet: '2022-06-16T06:52:22.419786Z',
        },
    ]
    person.sykmeldinger = [sendtSykmelding]
    return person
}
