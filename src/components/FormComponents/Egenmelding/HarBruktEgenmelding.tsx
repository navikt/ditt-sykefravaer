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
    firstPossibleDate: Date
    onNo: () => void
    umamiSkjemanavn: string
}

function HarBruktEgenmelding({
    index,
    firstPossibleDate,
    arbeidsgiverNavn,
    onNo,
    umamiSkjemanavn,
}: Props): ReactElement {
    const sykmeldingStartDato = toReadableDate(dateAdd(firstPossibleDate, { days: 1 }))

    return (
        <QuestionWrapper>
            <YesNoField<EgenmeldingsdagerSubForm>
                name={`egenmeldingsdager.${index}.harPerioder`}
                legend={`${sporsmal.harBruktEgenmeldingsdager(arbeidsgiverNavn)} før du ble sykmeldt ${sykmeldingStartDato}?`}
                description="Ta bare med de dagene du hadde egenmelding en hel dag."
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
            <ReadMore header="Spørsmålet forklart" open={open} onClick={handleOnReadMoreClick}>
                <BodyLong spacing>
                    Egenmelding er når du melder fra til arbeidsgiveren din om at du er syk og borte fra jobb – uten å
                    gå til lege.
                </BodyLong>
                <BodyLong spacing>
                    Nav trenger å vite om du brukte egenmelding før sykmeldingen, for å beregne riktig
                    arbeidsgiverperiode. Arbeidsgiverperiode er de første 16 kalenderdagene av et sykefravær, og betales
                    som oftest av arbeidsgiveren. Egenmeldingsdager teller med i arbeidsgiverperioden.
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
            <BodyLong spacing>
                Ettersom du har opplyst om at du har benyttet egenmeldingsdager i spørsmålet over, trenger vi også
                informasjon om du brukte egenmelding i løpet av de 16 dagene før egenmeldingsperioden i forrige periode.
            </BodyLong>
            <BodyLong spacing>
                Hvis det har gått mindre enn 16 dager fra du brukte egenmeldingsdager, til den første egenmeldingsdagen
                du oppgav i forrige spørsmål, kommer de med i beregningen av{' '}
                <Link
                    href="https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/sykepenger/sykepenger-i-arbeidsgiverperioden#chapter-1"
                    target="_blank"
                >
                    arbeidsgiverperioden.
                </Link>
            </BodyLong>
        </ReadMore>
    )
}

export default HarBruktEgenmelding
