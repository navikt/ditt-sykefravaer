import { ReactElement } from 'react'

import { Sykmelding } from '../../../../types/sykmelding/sykmelding'
import AvvistVeileder from '../../../AvvistVeileder/AvvistVeileder'
import StatusBanner from '../../../StatusBanner/StatusBanner'
import { getBehandlerName } from '../../../../utils/behandlerUtils'
import HintToNextOlderSykmelding from '../../../ForceOrder/HintToNextOlderSykmelding'
import SykmeldingSykmeldtSection from '../../../Sykmelding/SykmeldingerSykmeldt/SykmeldingSykmeldtSection'

interface InvalidBekreftetSykmeldingProps {
    sykmelding: Sykmelding
}

function InvalidBekreftetSykmelding({ sykmelding }: InvalidBekreftetSykmeldingProps): ReactElement {
    return (
        <div className="sykmelding-container">
            <div className="mb-16">
                <StatusBanner
                    sykmeldingStatus={sykmelding.sykmeldingStatus}
                    behandlingsutfall={sykmelding.behandlingsutfall}
                />
            </div>

            <div className="mb-8">
                <AvvistVeileder
                    behandlerNavn={getBehandlerName(sykmelding.behandler)}
                    behandlingsutfall={sykmelding.behandlingsutfall}
                    perioder={sykmelding.sykmeldingsperioder}
                />
            </div>

            <SykmeldingSykmeldtSection sykmelding={sykmelding} />

            <HintToNextOlderSykmelding />
        </div>
    )
}

export default InvalidBekreftetSykmelding
