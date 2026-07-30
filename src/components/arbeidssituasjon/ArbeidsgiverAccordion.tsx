import { Accordion } from '@navikt/ds-react'

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
        <Accordion.Item>
            <Accordion.Header>
                <strong>{orgNavn}</strong>
            </Accordion.Header>
            <Accordion.Content>
                <NarmesteLeder orgnummer={orgnummer} orgNavn={orgNavn} />
            </Accordion.Content>
        </Accordion.Item>
    )
}

export default ArbeidsgiverAccordion
