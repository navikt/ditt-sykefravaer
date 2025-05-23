import { ReactElement } from 'react'
import Link from 'next/link'
import { BodyShort, Heading, LinkPanel } from '@navikt/ds-react'

import { getReadableSykmeldingLength, getSykmeldingTitle } from '../../../utils/sykmeldingUtils'
import { getDescription } from '../../../utils/periodeUtils'
import { cn } from '../../../utils/tw-utils'
import { toSykmeldingAriaLabel } from '../../../utils/toSykmeldingAriaLabel'
import { Sykmelding } from '../../../types/sykmelding'

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
        <Link href={`/sykmelding/${id}`} passHref legacyBehavior>
            <LinkPanel
                className={cn('mb-4 p-6 [&>div]:w-full', {
                    'border-orange-300 bg-orange-50 hover:border-orange-500': notifying,
                })}
                border
            >
                <div className="flex gap-3 max-[560px]:flex-col">
                    <div className="mr-8 hidden md:block">
                        <LenkepanelIcon
                            behandlingsutfall={behandlingsutfallStatus}
                            isPaper={Boolean(papirsykmelding)}
                        />
                    </div>
                    <div className="grow" aria-label={toSykmeldingAriaLabel(sykmelding, sykmeldingPeriod)}>
                        <BodyShort>{sykmeldingPeriod}</BodyShort>
                        <Heading size="small" level="3">
                            {getSykmeldingTitle(sykmelding)}
                        </Heading>
                        <ul className="list-disc list-outside ms-4">
                            {sykmelding.sykmeldingsperioder.map((periode, index) => (
                                <li key={index} className="pl-1.5 leading-relaxed">
                                    {getDescription(periode, arbeidsgiverNavn)}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex shrink-0 items-center">
                        <LenkepanelEtikett status={status} behandlingsutfall={behandlingsutfallStatus} />
                    </div>
                </div>
            </LinkPanel>
        </Link>
    )
}

export default Lenkepanel
