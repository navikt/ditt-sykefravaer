import { ReactElement } from 'react'

import { toReadableDate } from '../../../../utils/dateUtils'
import { SykmeldingListInfo } from '../../../molecules/sykmelding/SykmeldingInfo'
import { Sykmelding } from '../../../../types/sykmelding'
import { DagerSvar } from '../../../../types/sykmeldingSporsmalSvarListe'

interface EgenmeldingsdagerProps {
    sykmeldingId: string
    egenmeldingsdager: DagerSvar
    sykmelding: Sykmelding
}

function Egenmeldingsdager({ egenmeldingsdager }: EgenmeldingsdagerProps): ReactElement | null {
    return (
        <SykmeldingListInfo
            heading="Egenmeldingsdager (lagt til av deg)"
            texts={[
                ...[...egenmeldingsdager.svar].sort().map(toReadableDate),
                `(${egenmeldingsdager.svar.length} dager)`,
            ]}
            variant="blue"
        />
    )
}

export default Egenmeldingsdager
