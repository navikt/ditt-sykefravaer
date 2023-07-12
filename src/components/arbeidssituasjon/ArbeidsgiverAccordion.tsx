import { Accordion, BodyShort } from '@navikt/ds-react'
import React from 'react'

import useNarmesteledere from '../../hooks/useNarmesteledere'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'

import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverAccordionProps {
    orgnummer: string
}

const ArbeidsgiverAccordion = ({ orgnummer }: ArbeidsgiverAccordionProps) => {
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: narmesteLedere } = useNarmesteledere()

    const orgNavn = sykmeldinger?.find(
        (syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn,
    )?.sykmeldingStatus.arbeidsgiver?.orgNavn

    const leder = narmesteLedere?.find((nl) => nl.orgnummer === orgnummer)

    return (
        <Accordion
            data-cy="arbeidsgiver-accordion"
            style={
                {
                    '--ac-accordion-header-bg': 'var(--a-blue-50)',
                } as React.CSSProperties
            }
        >
            <Accordion.Item>
                <Accordion.Header>
                    <strong>{orgNavn}</strong>
                </Accordion.Header>
                <Accordion.Content className="pt-3">
                    <Vis
                        hvis={leder?.arbeidsgiverForskutterer !== undefined}
                        render={() => (
                            <BodyShort spacing>
                                {tekst(
                                    `din-situasjon.arbeidsgiver-forskutterer${
                                        leder?.arbeidsgiverForskutterer
                                            ? ''
                                            : /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                              '-ikke'
                                    }` as any,
                                )}
                            </BodyShort>
                        )}
                    />
                    <NarmesteLeder orgnummer={orgnummer} orgNavn={orgNavn} />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )
}

export default ArbeidsgiverAccordion
