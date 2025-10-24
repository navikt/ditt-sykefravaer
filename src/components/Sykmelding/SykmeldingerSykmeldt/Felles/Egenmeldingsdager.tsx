import { ReactElement } from 'react'

import { toReadableDate } from '../../../../utils/dateUtils'
import { SykmeldingListInfo } from '../../../molecules/sykmelding/SykmeldingInfo'
import { Sykmelding } from '../../../../types/sykmelding/sykmelding'

interface EgenmeldingsdagerProps {
    sykmeldingId: string
    egenmeldingsdager: readonly string[]
    sykmelding: Sykmelding
}

function Egenmeldingsdager({ egenmeldingsdager }: EgenmeldingsdagerProps): ReactElement | null {
    return (
        <SykmeldingListInfo
            heading="Egenmeldingsdager (lagt til av deg)"
            texts={[...[...egenmeldingsdager].sort().map(toReadableDate), `(${egenmeldingsdager.length} dager)`]}
            variant="blue"
        />
    )
}

export default Egenmeldingsdager
