import React, { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { PencilWritingIcon } from '@navikt/aksel-icons'

import { Sykmelding } from '../../../../types/sykmelding/sykmelding'
import { finnOptInFrist } from '../../../../utils/sykmeldingUtils'
import StatusBanner from '../../../StatusBanner/StatusBanner'
import SykmeldingSykmeldtSection from '../../../Sykmelding/SykmeldingerSykmeldt/SykmeldingSykmeldtSection'
import { VentetidInfo } from '../../../SykmeldingVentetid/VentetidInfo'
import { useVisVentetidInfo } from '../../../../hooks/sykmelding/useVisVentetidInfo'

interface OkBekreftetSykmeldingProps {
    sykmelding: Sykmelding
    reopen: () => void
}

function OkBekreftetSykmelding({ sykmelding, reopen }: OkBekreftetSykmeldingProps): ReactElement {
    const optInFrist = finnOptInFrist(sykmelding)
    const visVentetidInfo = useVisVentetidInfo(
        sykmelding.id,
        sykmelding.sykmeldingStatus.brukerSvar?.arbeidssituasjon.svar,
    )
    return (
        <div className="sykmelding-container">
            <div className="mb-4">
                <StatusBanner
                    sykmeldingStatus={sykmelding.sykmeldingStatus}
                    behandlingsutfall={sykmelding.behandlingsutfall}
                    egenmeldt={sykmelding.egenmeldt}
                />
            </div>

            {!(sykmelding.egenmeldt != null && sykmelding.egenmeldt) && (
                <div className="mb-8">
                    <div className="mb-4">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                reopen()
                            }}
                            icon={<PencilWritingIcon aria-hidden />}
                        >
                            GJØR UTFYLLINGEN PÅ NYTT
                        </Button>
                    </div>
                </div>
            )}

            {visVentetidInfo && (
                <div className="mb-8">
                    <VentetidInfo sykmeldingId={sykmelding.id} optInFrist={optInFrist} />
                </div>
            )}

            <SykmeldingSykmeldtSection sykmelding={sykmelding} />
        </div>
    )
}

export default OkBekreftetSykmelding
