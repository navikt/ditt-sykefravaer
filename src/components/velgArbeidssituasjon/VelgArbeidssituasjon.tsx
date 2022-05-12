import { HelpText } from '@navikt/ds-react'
import React, { Dispatch, SetStateAction } from 'react'

import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'
import Vis from '../Vis'

interface VelgArbeidssituasjonProps {
    kanVelge: boolean
    setVisning: Dispatch<SetStateAction<Visning>>
    medHjelpetekst: boolean
}

const VelgArbeidssituasjon = ({
    kanVelge,
    setVisning,
    medHjelpetekst,
}: VelgArbeidssituasjonProps) => {
    const alternativer = [
        {
            tittel: 'Jeg har arbeidsgiver',
            verdi: 'MED_ARBEIDSGIVER',
        },
        {
            tittel: 'Jeg har ikke arbeidsgiver',
            verdi: 'UTEN_ARBEIDSGIVER',
            hjelpetekst:
                'Velg «Jeg har ikke arbeidsgiver» dersom du er for eks. selvstendig næringsdrivende, frilanser eller arbeidsledig.',
        },
    ]

    return (
        <Vis
            hvis={kanVelge}
            render={() => (
                <div className="radiofaner">
                    {alternativer.map((a, idx) => (
                        <div
                            key={idx}
                            className="navds-radio navds-radio--medium"
                        >
                            <input
                                type="radio"
                                name="velgArbeidssituasjon"
                                id={'velg-arb-sit' + idx}
                                className="navds-radio__input"
                                value={a.verdi}
                                defaultChecked={a.verdi === 'MED_ARBEIDSGIVER'}
                                onChange={() => {
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    setVisning(a.verdi as any)
                                }}
                            />
                            <label
                                className="navds-radio__label"
                                htmlFor={'velg-arb-sit' + idx}
                            >
                                {a.tittel}
                            </label>

                            <Vis
                                hvis={medHjelpetekst && a.hjelpetekst}
                                render={() => (
                                    <HelpText>{a.hjelpetekst}</HelpText>
                                )}
                            />
                        </div>
                    ))}
                </div>
            )}
        />
    )
}

export default VelgArbeidssituasjon
