import { Knapp } from 'nav-frontend-knapper'
import { Normaltekst } from 'nav-frontend-typografi'
import React, { SyntheticEvent, useState } from 'react'

import Vis from '../../components/Vis'
import useBekreftAktivitetskrav from '../../query-hooks/useBekreftAktivitetskrav'
import { tekst } from '../../utils/tekster'

const BekreftAktivitetskravSkjema = () => {
    const [ check, setCheck ] = useState<boolean | undefined>(undefined)
    const { mutate: bekreft, isLoading } = useBekreftAktivitetskrav()

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        if (check === true) bekreft()
    }

    return (
        <form onSubmit={handleSubmit} className="bekreft-aktivitetskrav">
            <div className="skjemaelement">
                <input id="bekreftAktivitetskrav" type="checkbox"
                    className="skjemaelement__input checkboks"
                    onChange={(e) => setCheck(e.currentTarget.checked)}
                />
                <label className="skjemaelement__label" htmlFor="bekreftAktivitetskrav">
                    <Normaltekst tag="span">{tekst('aktivitetskrav-varsel.bekreft-label')}</Normaltekst>
                </label>
                <Vis hvis={check === false}
                    render={() =>
                        <Normaltekst className="typo-feilmelding">
                            {tekst('aktivitetskrav-varsel.bekreft-feilmelding')}
                        </Normaltekst>
                    }
                />
            </div>

            <div className="knapperad">
                <Knapp type="hoved" spinner={isLoading}>
                    BEKREFT
                </Knapp>
            </div>
        </form>
    )
}

export default BekreftAktivitetskravSkjema
