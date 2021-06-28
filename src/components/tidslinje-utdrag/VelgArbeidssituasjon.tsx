import { Radio } from 'nav-frontend-skjema'
import React, { Dispatch, SetStateAction } from 'react'

import Vis from '../Vis'
import { Visning } from './TidslinjeUtdrag'

interface VelgArbeidssituasjonProps { kanVelge: boolean, setVisning: Dispatch<SetStateAction<Visning>> }
const VelgArbeidssituasjon = ({ kanVelge, setVisning }: VelgArbeidssituasjonProps) => {
    const alternativer = [ {
        tittel: 'Jeg har arbeidsgiver',
        verdi: 'MED_ARBEIDSGIVER',
    }, {
        tittel: 'Jeg har ikke arbeidsgiver',
        verdi: 'UTEN_ARBEIDSGIVER',
    } ]

    return (
        <Vis hvis={kanVelge}>
            <div className="radiofaner">
                {alternativer.map((a, idx) =>
                    <Radio key={idx}
                        name="velgArbeidssituasjon"
                        label={a.tittel}
                        value={a.verdi}
                        defaultChecked={a.verdi === 'MED_ARBEIDSGIVER'}
                        onChange={() => {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            setVisning(a.verdi as any)
                        }}
                    />
                )}
            </div>
        </Vis>
    )
}

export default VelgArbeidssituasjon
