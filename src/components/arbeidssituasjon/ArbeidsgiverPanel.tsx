import { BodyShort, Panel } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverPanelProps {
    orgnummer: string
}

const ArbeidsgiverPanel = ({ orgnummer }: ArbeidsgiverPanelProps) => {
    const [navn, setNavn] = useState<string>('')
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: narmesteLedere } = useNarmesteledere()

    useEffect(() => {
        const orgNavn = sykmeldinger!.find(
            (syk) =>
                syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn
        )?.sykmeldingStatus.arbeidsgiver?.orgNavn
        setNavn(orgNavn!)
    }, [orgnummer, sykmeldinger])

    const leder = narmesteLedere ? narmesteLedere.find((nl) => nl.orgnummer === orgnummer) : null

    return (
        <Panel className="situasjon__innhold">
            <BodyShort spacing>
                <strong>{navn}</strong>
            </BodyShort>
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
            <NarmesteLeder orgnummer={orgnummer} orgNavn={navn} />
        </Panel>
    )
}

export default ArbeidsgiverPanel
