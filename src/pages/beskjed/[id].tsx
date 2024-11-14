import { Skeleton } from '@navikt/ds-react'
import React from 'react'
import { useRouter } from 'next/router'

import { beskyttetSideUtenProps } from '../../auth/beskyttetSide'
import useMeldinger from '../../hooks/useMeldinger'
import { ForelagtInntektFraAordningen } from '../../components/opplysningerFraAordningen/hentetFraAordningen'
import { skapMeldinger } from '../../components/oppgaver/meldinger'
import { EnkeltOppgaveAlert } from '../../components/oppgaver/Oppgaver'

export interface Inntekt {
    maned: string
    belop: number | null
}

const Beskjed = () => {
    const router = useRouter()
    const { id } = router.query

    const { data: meldinger, isLoading: meldingerLaster } = useMeldinger()

    if (meldingerLaster) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }
    const melding = meldinger?.find((m) => m.uuid === id)
    if (melding) {
        if (melding.meldingType === 'FORELAGT_INNTEKT_FRA_AAREG') {
            return <ForelagtInntektFraAordningen melding={melding} />
        }
        const task = skapMeldinger([melding])[0]
        return <EnkeltOppgaveAlert oppgave={task} pushLukket={() => {}} />
    }
    window.location.href = '/syk/sykefravaer'
    return <span>Du blir sendt videre...</span>
}

export const getServerSideProps = beskyttetSideUtenProps

export default Beskjed
