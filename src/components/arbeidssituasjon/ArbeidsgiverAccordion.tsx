import { Accordion, BodyShort } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import useNarmesteledere from '../../query-hooks/useNarmesteledere'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'
import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverAccordionProps {
    orgnummer: string
}

const ArbeidsgiverAccordion = ({ orgnummer }: ArbeidsgiverAccordionProps) => {
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

    const leder = narmesteLedere?.find((nl) => nl.orgnummer === orgnummer)

    return (
        <Accordion className="arbeidsgiver-accordion">
            <Accordion.Item>
                <Accordion.Header>
                    <strong>{navn}</strong>
                </Accordion.Header>
                <Accordion.Content>
                    <Vis
                        hvis={leder?.arbeidsgiverForskutterer !== undefined}
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
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )
}

export default ArbeidsgiverAccordion
