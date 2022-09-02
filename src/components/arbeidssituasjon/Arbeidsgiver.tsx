import { BodyShort } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { Sykmelding } from '../../types/sykmelding'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverProps {
    orgnummer: string
}

const Arbeidsgiver = ({ orgnummer }: ArbeidsgiverProps) => {
    const [meldinger, setMeldinger] = useState<Sykmelding[]>()
    const [navn, setNavn] = useState<string>('')
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: narmesteLedere } = useNarmesteledere()

    useEffect(() => {
        const orgNavn = sykmeldinger!.find(
            (syk) =>
                syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn
        )?.sykmeldingStatus.arbeidsgiver?.orgNavn
        setNavn(orgNavn!)
        setMeldinger(sykmeldinger!)
    }, [orgnummer, sykmeldinger])

    const leder = narmesteLedere
        ? narmesteLedere
              .filter((nl) => !nl.aktivTom && nl.navn) // Aktiv og har navn på leder
              .find((nl) => nl.orgnummer === orgnummer)
        : null

    if (!meldinger) return null

    return (
        <div className="situasjon__innhold">
            <BodyShort spacing>
                {tekst('din-situasjon.ansatt')}
                <strong>{navn}</strong>
            </BodyShort>
            <NarmesteLeder orgnummer={orgnummer} orgNavn={navn} />
            <Vis
                hvis={leder?.arbeidsgiverForskutterer !== null}
                render={() => (
                    <div className="leder__forskuttering">
                        <BodyShort>
                            {tekst(
                                `din-situasjon.arbeidsgiver-forskutterer${
                                    leder?.arbeidsgiverForskutterer
                                        ? ''
                                        : /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                          '-ikke'
                                }` as any
                            )}
                        </BodyShort>
                    </div>
                )}
            />
        </div>
    )
}

export default Arbeidsgiver
