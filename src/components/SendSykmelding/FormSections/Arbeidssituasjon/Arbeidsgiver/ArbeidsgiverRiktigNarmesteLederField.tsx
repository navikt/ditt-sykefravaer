import { ReactElement } from 'react'
import { useFormContext } from 'react-hook-form'
import { Alert, BodyLong, ReadMore } from '@navikt/ds-react'

import { YesOrNo } from '../../../../../types/sykmelding/sykmeldingCommon'
import { QuestionWrapper } from '../../../../FormComponents/FormStructure'
import { sporsmal } from '../../../../../utils/sporsmal'
import YesNoField from '../../../../FormComponents/YesNoField/YesNoField'
import { FormValues } from '../../../SendSykmeldingForm'
import { NaermesteLeder } from '../../../../../types/sykmelding/brukerinformasjon'

interface Props {
    narmesteLeder: NaermesteLeder
}

function ArbeidsgiverRiktigNarmesteLederField({ narmesteLeder }: Props): ReactElement {
    const { watch } = useFormContext<FormValues>()

    const riktigNarmesteLeder = watch('riktigNarmesteLeder')

    return (
        <QuestionWrapper>
            <YesNoField<FormValues>
                name="riktigNarmesteLeder"
                legend={sporsmal.riktigNarmesteLeder(narmesteLeder.navn)}
                subtext={
                    <ReadMore header="Les om hva det innebærer">
                        <BodyLong spacing>
                            Navnet kommer fra arbeidsgiveren din. Det er arbeidsgiveren som registrerer hvem som har
                            oppfølgingsansvaret — du kan ikke endre dette selv.
                        </BodyLong>
                        <BodyLong spacing>
                            Den vi spør om vil få se sykmeldingen din og kan bli kontaktet av Nav underveis i
                            sykefraværet. Hør med arbeidsgiveren din hvis du mener det er en annen de skulle meldt inn i
                            stedet. En kort prat med nærmeste leder så tidlig som mulig i fraværet gjør det enklere for
                            begge. Du trenger ikke si noe om diagnosen.
                        </BodyLong>
                        <BodyLong spacing>Mener du det er feil person, velger du «Nei, det er feil person».</BodyLong>
                    </ReadMore>
                }
                rules={{
                    required: 'Du må svare på om dette er nærmeste lederen som skal følge deg opp.',
                }}
                jaTekst="Ja, det stemmer"
                neiTekst="Nei, det er feil person"
            />
            {riktigNarmesteLeder != null && (
                <Alert className="my-8" variant="info" aria-live="polite">
                    {riktigNarmesteLeder === YesOrNo.YES
                        ? `Vi sender sykmeldingen til ${narmesteLeder.navn}, som finner den ved å logge inn på nav.no`
                        : 'Vi ber arbeidsgiveren din om å oppdatere navnet. Du trenger ikke gjøre noe mer.'}
                </Alert>
            )}
        </QuestionWrapper>
    )
}

export default ArbeidsgiverRiktigNarmesteLederField
