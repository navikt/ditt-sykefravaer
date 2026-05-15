import { Accordion } from '@navikt/ds-react'
import React from 'react'

import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'

import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverAccordionProps {
    orgnummer: string
}

const ArbeidsgiverAccordion = ({ orgnummer }: ArbeidsgiverAccordionProps) => {
    const { data: sykmeldinger } = useTsmSykmeldinger()

    const orgNavn = sykmeldinger?.find(
        (syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn,
    )?.sykmeldingStatus.arbeidsgiver?.orgNavn

    return (
        <Accordion
            data-testid="arbeidsgiver-accordion"
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
                    <NarmesteLeder orgnummer={orgnummer} orgNavn={orgNavn} />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )
}

export default ArbeidsgiverAccordion
