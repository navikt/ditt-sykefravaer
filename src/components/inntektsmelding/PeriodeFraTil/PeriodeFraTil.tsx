import { BodyShort, Label } from '@navikt/ds-react'

import { formatDateFromString } from '../formatDate'

interface PeriodeFraTilProps {
    fom: string
    tom: string
}

export default function PeriodeFraTil(props: PeriodeFraTilProps) {
    return (
        <div className="mt-4">
            <div className="w-1/2  inline-block">
                <Label>Fra</Label>
                <BodyShort>{formatDateFromString(props.fom)}</BodyShort>
            </div>
            <div className="w-1/2  inline-block">
                <Label>Til</Label>
                <BodyShort>{formatDateFromString(props.tom)}</BodyShort>
            </div>
        </div>
    )
}
