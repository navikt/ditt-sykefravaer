import { useFormContext } from 'react-hook-form'
import { SectionWrapper } from '../../../../FormComponents/FormStructure'
import FiskerArbeidsgiverField from './FiskerArbeidsgiverField'
import { Arbeidsgiver } from '../../../../../server/api-models/Arbeidsgiver'
import EgenmeldingerField from '../../../../FormComponents/Egenmelding/EgenmeldingerField'
import { toDate } from '../../../../../utils/dateUtils'
import { getSykmeldingStartDate } from '../../../../../utils/sykmeldingUtils'
import { FormValues } from '../../../SendSykmeldingForm'
import useSykmeldinger from '../../../../../hooks/sykmelding/useSykmeldinger'
import { findPrevSykmeldingTom } from '../../../../../utils/findPrevSykmeldingTom'
import { Sykmelding } from '../../../../../types/sykmelding/sykmelding'

interface FiskerHyreSectionProps {
    arbeidsgivere: Arbeidsgiver[]
    sykmelding: Sykmelding
}

export default function FiskerHyreSection({ arbeidsgivere, sykmelding }: FiskerHyreSectionProps) {
    const { watch } = useFormContext<FormValues>()
    const [valgtArbeidsgiverOrgnummer]: [string | null] = watch(['arbeidsgiverOrgnummer'])

    const { data: alleSykmeldinger } = useSykmeldinger()
    const previousSykmeldingTom =
        alleSykmeldinger != null
            ? findPrevSykmeldingTom(sykmelding, valgtArbeidsgiverOrgnummer, alleSykmeldinger)
            : null
    return (
        <SectionWrapper>
            <FiskerArbeidsgiverField arbeidsgivere={arbeidsgivere} />
            <EgenmeldingerField
                index={0}
                previous={{
                    earliestPossibleDate: toDate(getSykmeldingStartDate(sykmelding.sykmeldingsperioder)),
                    earliestSelectedDate: null,
                }}
                metadata={{
                    arbeidsgiverNavn: 'greg',
                    previousSykmeldingTom: previousSykmeldingTom,
                }}
                umamiSkjemanavn="Egenmeldingsdager"
            />
        </SectionWrapper>
    )
}
