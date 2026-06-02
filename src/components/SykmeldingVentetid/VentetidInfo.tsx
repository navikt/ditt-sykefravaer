import { ReactElement, useState } from 'react'
import { BodyShort, Heading, ReadMore } from '@navikt/ds-react'

import { LenkeMedIkon } from '../lenke/lenke-med-ikon'
import { tilLesbarDatoMedArstall } from '../../utils/dato-utils'

import { OptIn } from './OptIn'

export function VentetidInfo({ sykmeldingId, optInFrist }: { sykmeldingId: string; optInFrist: Date }): ReactElement {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Heading size="medium" level="2" spacing>
                Hva skjer videre?
            </Heading>
            <BodyShort className="mt-6" weight="semibold" spacing>
                Hvis du er syk i mindre enn 16 dager
            </BodyShort>
            <BodyShort spacing>
                Du får som hovedregel ikke sykepenger de første 16 kalenderdagene. Dagene telles fra du oppsøker lege,
                eller fra Nav får beskjed om at du er syk og ikke kan jobbe.
            </BodyShort>
            <ReadMore
                header="Om din rett til å søke om sykepenger"
                className="mt-4"
                open={open}
                onClick={() => setOpen(!open)}
            >
                <BodyShort spacing>
                    Det er Nav som avgjør om du oppfyller vilkårene for å få sykepenger eller ei, men alle har rett til
                    å søke.
                </BodyShort>
                <BodyShort className="mt-4" weight="semibold" spacing>
                    Vil du søke om sykepenger?
                </BodyShort>
                <BodyShort>
                    Hvis du mener du har rett på sykepenger for denne sykmeldingsperioden og du vil søke om sykepenger,
                    har du rett til det. Fristen for å be om søknad er {tilLesbarDatoMedArstall(optInFrist)}.
                </BodyShort>
                <BodyShort className="mt-4" spacing>
                    <OptIn sykmeldingId={sykmeldingId} enabled={open} optInFrist={optInFrist} />
                </BodyShort>
            </ReadMore>
            <BodyShort className="mt-6" weight="semibold" spacing>
                Hvis du er syk i mer enn 16 dager
            </BodyShort>
            <BodyShort spacing>
                Varer sykefraværet ditt mer enn 16 dager, dekker Nav sykepengene dine fra dag 17. Vi gir deg beskjed når
                du kan søke om sykepenger.
            </BodyShort>
            <LenkeMedIkon href="https://www.nav.no/sykepenger#hva" text="Les mer om hva du kan få i sykepenger." />
        </>
    )
}
