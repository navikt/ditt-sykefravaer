import { ReactElement } from 'react'
import NextLink from 'next/link'
import { BodyShort, LinkCard } from '@navikt/ds-react'

import { getReadableSykmeldingLength, getSykmeldingTitle } from '../../../utils/sykmeldingUtils'
import { getDescription } from '../../../utils/periodeUtils'
import { Sykmelding } from '../../../types/sykmelding/sykmelding'

import LenkepanelIcon from './LenkepanelIcon'
import LenkepanelEtikett from './LenkepanelEtikett'

interface LenkepanelProps {
    sykmelding: Sykmelding
    notifying: boolean
}

export function Lenkepanel({ sykmelding, notifying }: LenkepanelProps): ReactElement {
    const { status, behandlingsutfallStatus, arbeidsgiverNavn, id, papirsykmelding } = {
        status: sykmelding.sykmeldingStatus.statusEvent,
        behandlingsutfallStatus: sykmelding.behandlingsutfall.status,
        arbeidsgiverNavn: sykmelding.sykmeldingStatus.arbeidsgiver?.orgNavn ?? '',
        id: sykmelding.id,
        papirsykmelding: sykmelding.papirsykmelding ?? false,
    }
    const sykmeldingPeriod: string = getReadableSykmeldingLength(sykmelding)

    return (
        <LinkCard className="mb-4" data-color={notifying ? 'warning' : undefined}>
            <LinkCard.Icon className="hidden ax-md:block">
                <LenkepanelIcon behandlingsutfall={behandlingsutfallStatus} isPaper={Boolean(papirsykmelding)} />
            </LinkCard.Icon>
            <LinkCard.Title>
                <LinkCard.Anchor asChild>
                    <NextLink href={`/sykmeldinger/${id}`}>{getSykmeldingTitle(sykmelding)}</NextLink>
                </LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>
                <BodyShort>{sykmeldingPeriod}</BodyShort>
                <ul className="list-disc list-outside ms-4">
                    {sykmelding.sykmeldingsperioder.map((periode, index) => (
                        <li key={index} className="pl-1.5 leading-relaxed">
                            {getDescription(periode, arbeidsgiverNavn)}
                        </li>
                    ))}
                </ul>
            </LinkCard.Description>
            <LenkepanelEtikett status={status} behandlingsutfall={behandlingsutfallStatus} />
        </LinkCard>
    )
}

export default Lenkepanel
