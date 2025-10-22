import { Accordion, BodyShort } from '@navikt/ds-react'
import React from 'react'

import useNarmesteledere from '../../hooks/useNarmesteledere'
import useTsmSykmeldinger from '../../hooks/useDittSykefravaerSykmeldinger'
import { tekst } from '../../utils/tekster'

import NarmesteLeder from './NarmesteLeder'

interface ArbeidsgiverAccordionProps {
    orgnummer: string
}

const ArbeidsgiverAccordion = ({ orgnummer }: ArbeidsgiverAccordionProps) => {
    const { data: sykmeldinger } = useTsmSykmeldinger()
    const { data: narmesteLedere } = useNarmesteledere()

    const orgNavn = sykmeldinger?.find(
        (syk) =>
            syk.sykmeldingStatus.arbeidsgiver?.orgnummer === orgnummer && syk.sykmeldingStatus.arbeidsgiver?.orgNavn,
    )?.sykmeldingStatus.arbeidsgiver?.orgNavn

    const leder = narmesteLedere?.find((nl) => nl.orgnummer === orgnummer)

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
                    {leder?.arbeidsgiverForskutterer !== undefined && (
                        <BodyShort spacing>
                            {tekst(
                                `din-situasjon.arbeidsgiver-forskutterer${
                                    leder?.arbeidsgiverForskutterer ? '' : '-ikke'
                                }`,
                            )}
                        </BodyShort>
                    )}
                    <NarmesteLeder orgnummer={orgnummer} orgNavn={orgNavn} />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )
}

export default ArbeidsgiverAccordion
