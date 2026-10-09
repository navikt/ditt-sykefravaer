import { useFormContext } from 'react-hook-form'
import { SectionWrapper } from '../../../../FormComponents/FormStructure'
import FiskerArbeidsgiverField from './FiskerArbeidsgiverField'
import EgenmeldingerField from '../../../../FormComponents/Egenmelding/EgenmeldingerField'
import { toDate } from '../../../../../utils/dateUtils'
import { getSykmeldingStartDate } from '../../../../../utils/sykmeldingUtils'
import { FormValues } from '../../../SendSykmeldingForm'
import useSykmeldinger from '../../../../../hooks/sykmelding/useSykmeldinger'
import { findPrevSykmeldingTom } from '../../../../../utils/findPrevSykmeldingTom'
import { Sykmelding } from '../../../../../types/sykmelding/sykmelding'
import { Blad, LottOgHyre } from '../../../../../types/sykmelding/sykmeldingCommon'
import { Arbeidsgiver } from '../../../../../types/sykmelding/brukerinformasjon'

interface FiskerHyreSectionProps {
    arbeidsgivere: Arbeidsgiver[]
    sykmelding: Sykmelding
    metadata: {
        blad: Blad | null
        lottOgHyre: LottOgHyre | null
    }
}

export default function FiskerHyreSection({ arbeidsgivere, sykmelding, metadata }: FiskerHyreSectionProps) {
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
            {metadata.blad != Blad.B && (
                <EgenmeldingerField
                    index={0}
                    previous={{
                        earliestPossibleDate: toDate(getSykmeldingStartDate(sykmelding.sykmeldingsperioder)),
                        earliestSelectedDate: null,
                    }}
                    metadata={{
                        previousSykmeldingTom: previousSykmeldingTom,
                    }}
                    umamiSkjemanavn="Egenmeldingsdager"
                />
            )}
        </SectionWrapper>
    )
}
