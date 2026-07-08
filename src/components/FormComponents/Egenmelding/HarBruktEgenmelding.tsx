import { BodyLong, BodyShort, Link, List, ReadMore } from '@navikt/ds-react'
import { ReactElement, useState } from 'react'

import { dateAdd, toReadableDate } from '../../../utils/dateUtils'
import { sporsmal } from '../../../utils/sporsmal'
import { logUmamiEvent } from '../../umami/umami'
import YesNoField from '../YesNoField/YesNoField'
import { QuestionWrapper } from '../FormStructure'
import { YesOrNo } from '../../../types/sykmelding/sykmeldingCommon'

import { EgenmeldingsdagerSubForm } from './EgenmeldingerField'

interface Props {
    index: number
    arbeidsgiverNavn: string
    muligTomDato: Date
    muligFomDato: Date
    onNo: () => void
    umamiSkjemanavn: string
}

function HarBruktEgenmelding({
    index,
    muligTomDato,
    muligFomDato,
    arbeidsgiverNavn,
    onNo,
    umamiSkjemanavn,
}: Props): ReactElement {
    const sykmeldingStartDato = toReadableDate(dateAdd(muligTomDato, { days: 1 }))
    const fraOgMed = toReadableDate(muligFomDato)
    const tilOgMed = toReadableDate(muligTomDato)

    const legend =
        index === 0
            ? `${sporsmal.harBruktEgenmeldingsdager(arbeidsgiverNavn)} før du ble sykmeldt ${sykmeldingStartDato}?`
            : `Hadde du egenmeldingsdager før det igjen – altså mellom ${fraOgMed} og ${tilOgMed}?`

    const description =
        index === 0
            ? 'Ta bare med de dagene du hadde egenmelding en hel dag.'
            : 'Ta bare med dagene du var borte fra jobb hele dagen.'

    return (
        <QuestionWrapper>
            <YesNoField<EgenmeldingsdagerSubForm>
                name={`egenmeldingsdager.${index}.harPerioder`}
                legend={legend}
                description={description}
                subtext={<EgenmeldingReadMore index={index} />}
                rules={{
                    required: 'Du må svare på om du har brukt egenmelding før du ble syk.',
                }}
                onChange={(value: YesOrNo) => {
                    logUmamiEvent(
                        {
                            eventName: 'skjema spørsmål besvart',
                            data: {
                                skjemanavn: umamiSkjemanavn,
                                spørsmål: 'Har du brukt egenmeldingsdager i perioden?',
                                svar: value,
                            },
                        },
                        { level: index + 1 },
                    )

                    if (value === YesOrNo.NO) {
                        onNo()
                    }
                }}
            />
        </QuestionWrapper>
    )
}

function EgenmeldingReadMore({ index }: { index: number }): ReactElement {
    const [open, setOpen] = useState(false)
    const handleOnReadMoreClick = (): void => {
        if (!open) {
            logUmamiEvent(
                {
                    eventName: 'komponent vist',
                    data: { komponent: 'EgenmeldingsdagerReadMore' },
                },
                { level: index + 1 },
            )
        }

        setOpen((b) => !b)
    }

    if (index === 0) {
        return (
            <ReadMore header="Hvorfor spør vi om egenmelding?" open={open} onClick={handleOnReadMoreClick}>
                <BodyLong spacing>
                    Egenmelding er når du melder fra til arbeidsgiveren din om at du er syk og borte fra jobb – uten å
                    ha fått sykmelding.
                </BodyLong>
                <BodyLong spacing>
                    Nav trenger å vite om du brukte egenmelding i de 16 dagene før sykmeldingen startet, for å beregne
                    riktig arbeidsgiverperiode. De første 16 kalenderdagene av et sykefravær betales vanligvis av
                    arbeidsgiveren – dette kalles arbeidsgiverperioden . Egenmeldingsdager teller med i disse 16 dagene.
                </BodyLong>
                <BodyShort spacing>
                    <strong>Svar ja hvis:</strong>
                </BodyShort>
                <List as="ul">
                    <List.Item>
                        du var borte fra jobb og meldte fra til arbeidsgiveren selv – uten å ha fått sykmelding
                    </List.Item>
                </List>
                <BodyShort spacing>
                    <strong>Svar nei hvis:</strong>
                </BodyShort>
                <List as="ul">
                    <List.Item>du var borte fra jobb deler av dagen</List.Item>
                    <List.Item>
                        du var hjemme fordi barnet ditt var sykt. Da kan du ha{' '}
                        <Link href="https://www.nav.no/omsorgspenger" target="_blank">
                            rett til omsorgsdager
                        </Link>
                        .
                    </List.Item>
                </List>
                <Link href="https://www.nav.no/egenmelding" target="_blank">
                    Les mer om egenmeldingsdager
                </Link>
            </ReadMore>
        )
    }

    return (
        <ReadMore header="Hvorfor spør vi igjen?" open={open} onClick={handleOnReadMoreClick}>
            <BodyLong>
                Hadde du egenmelding innenfor 16 dager før en annen egenmeldingsperiode, telles dagene sammen når vi
                beregner arbeidsgiverperioden.
            </BodyLong>
        </ReadMore>
    )
}

export default HarBruktEgenmelding
