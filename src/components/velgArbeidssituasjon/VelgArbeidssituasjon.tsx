import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Radio } from 'nav-frontend-skjema'
import React, { Dispatch, SetStateAction } from 'react'

import { Visning } from '../tidslinje-utdrag/TidslinjeUtdrag'
import Vis from '../Vis'

interface VelgArbeidssituasjonProps {
    kanVelge: boolean,
    setVisning: Dispatch<SetStateAction<Visning>>,
    medHjelpetekst: boolean
}

const VelgArbeidssituasjon = ({ kanVelge, setVisning, medHjelpetekst }: VelgArbeidssituasjonProps) => {
    const alternativer = [ {
        tittel: 'Jeg har arbeidsgiver',
        verdi: 'MED_ARBEIDSGIVER',
    }, {
        tittel: 'Jeg har ikke arbeidsgiver',
        verdi: 'UTEN_ARBEIDSGIVER',
        hjelpetekst: 'Velg «Jeg har ikke arbeidsgiver» dersom du er for eks. selvstendig næringsdrivende, frilanser eller arbeidsledig.'
    } ]

    return (
        <Vis hvis={kanVelge}
            render={() =>
                <div className="radiofaner">
                    {alternativer.map((a, idx) =>
                        <div key={idx} className="radio">
                            <Radio
                                name="velgArbeidssituasjon"
                                label={a.tittel}
                                value={a.verdi}
                                defaultChecked={a.verdi === 'MED_ARBEIDSGIVER'}
                                onChange={() => {
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    setVisning(a.verdi as any)
                                }}
                            />
                            <Vis hvis={medHjelpetekst && a.hjelpetekst}
                                render={() =>
                                    <Hjelpetekst>{a.hjelpetekst}</Hjelpetekst>
                                }
                            />
                        </div>
                    )}
                </div>
            }
        />
    )
}

export default VelgArbeidssituasjon
