import React, { useEffect, useMemo, useState } from 'react'
import { ExpansionCard, BodyLong } from '@navikt/ds-react'
import dayjs from 'dayjs'

import useMaxDate from '../../hooks/useMaxDate'
import { tilLesbarDatoMedArstall } from '../../utils/dato-utils'
import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'
import { logEvent } from '../umami/umami'
import { LenkeMedUmami } from '../lenke/lenke-med-umami'

import { skalViseMaksDato, erSykmeldingInnafor } from './skalViseMaksDato'

const Maksdato = () => {
    const { data: sykmeldinger } = useTsmSykmeldinger()
    const { data: maxdate } = useMaxDate(
        sykmeldinger?.some((sykmelding) => erSykmeldingInnafor(sykmelding, 17)) ?? false,
    )

    if (!maxdate || !skalViseMaksDato(sykmeldinger || [], maxdate)) {
        return null
    }

    return <MaksdatoExpansionCard utbetaltTom={maxdate.utbetaltTom!} maxDate={maxdate.maxDate!} />
}

const MaksdatoExpansionCard = ({ utbetaltTom, maxDate }: { utbetaltTom: string; maxDate: string }) => {
    const sisteUtbetaling = tilLesbarDatoMedArstall(utbetaltTom)
    const maksdato = tilLesbarDatoMedArstall(maxDate)
    const [open, setOpen] = useState<boolean>(false)

    const umamiMeta = useMemo(() => {
        return {
            komponent: 'Maksdato expansioncard',
            dagerTilMaksdato: dayjs(maxDate).diff(dayjs(), 'days'),
            dagerSidenSisteUtbetaling: dayjs().diff(dayjs(utbetaltTom), 'days'),
        }
    }, [maxDate, utbetaltTom])

    useEffect(() => {
        logEvent('komponent vist', umamiMeta)
    }, [umamiMeta])

    return (
        <>
            <ExpansionCard size="small" open={open} className="mt-8" aria-label="Beregnet slutt på sykepenger">
                <ExpansionCard.Header
                    onClick={() => {
                        logEvent(open ? 'expansioncard lukket' : 'expansioncard åpnet', umamiMeta)
                        setOpen(!open)
                    }}
                >
                    <ExpansionCard.Title as="h2" size="small">
                        Beregnet slutt på sykepenger
                    </ExpansionCard.Title>
                    <ExpansionCard.Description>
                        Maksdato per {sisteUtbetaling} er {maksdato}
                    </ExpansionCard.Description>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    <BodyLong spacing>
                        Du kan maksimalt få sykepenger fra NAV i 52 uker. Grensen er den samme enten du er helt eller
                        delvis sykmeldt og kalles også maksdato. Datoen gjelder hvis du er sammenhengende sykmeldt. Den
                        vil flytte seg hvis du for eksempel ikke får sykepenger fra NAV i perioder, eller hvis du tar
                        ferie.
                    </BodyLong>

                    <BodyLong spacing>
                        Sykefravær inntil 3 år tilbake i tid blir lagt sammen hvis det er mindre enn 26 uker mellom noen
                        av fraværene.
                    </BodyLong>

                    <BodyLong spacing>
                        {
                            'Hvis du har brukt opp de 52 ukene, må det gå 26 uker uten sykepenger eller Arbeidsavklaringspenger (AAP) før du kan få sykepenger igjen, du kan lese mer om dette i '
                        }
                        <LenkeMedUmami
                            url="https://lovdata.no/nav/folketrygdloven/kap8/%C2%A78-12"
                            tekst="folketrygdloven § 8-12."
                        ></LenkeMedUmami>
                        {
                            ' Blir du syk på nytt før disse ukene har gått, kan det være aktuelt med AAP som erstatning for sykepenger. Ta gjerne kontakt med NAV eller snakk med veilederen din om dette. '
                        }
                    </BodyLong>

                    <BodyLong spacing>
                        <LenkeMedUmami
                            url="https://www.nav.no/sykepenger#hvor-lenge"
                            tekst="Det er egne regler for deg som er mellom 67 og 70 år."
                        ></LenkeMedUmami>
                    </BodyLong>

                    <BodyLong>
                        Hvis du har fått sykepenger i 52 uker og fortsatt ikke kan arbeide på grunn av sykdom eller
                        skade, kan du ha rett til arbeidsavklaringspenger eller uføretrygd.
                        <LenkeMedUmami
                            url="https://www.nav.no/sykepenger#hvor-lenge"
                            tekst="Les mer om mulighetene dine etter det er slutt på sykepengene."
                        ></LenkeMedUmami>
                    </BodyLong>
                </ExpansionCard.Content>
            </ExpansionCard>
        </>
    )
}

export default Maksdato
