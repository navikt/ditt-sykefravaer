import Alertstripe from 'nav-frontend-alertstriper'
import { Knapp } from 'nav-frontend-knapper'
import { Normaltekst } from 'nav-frontend-typografi'
import React, { SyntheticEvent, useState } from 'react'

import Vis from '../../components/Vis'
import useBekreftAktivitetskrav from '../../query-hooks/useBekreftAktivitetskrav'
import { tekst } from '../../utils/tekster'

const BekreftAktivitetskravSkjema = () => {
    const [ check, setCheck ] = useState<boolean>(false)
    const [ buttonClicked, setButtonClicked ] = useState<boolean>(false)
    const { mutate: bekreft, isLoading } = useBekreftAktivitetskrav()

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        setButtonClicked(true)
        if (check) bekreft()
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
                <Vis hvis={!check && buttonClicked}
                    render={() =>
                        <Normaltekst className="typo-feilmelding">
                            {tekst('aktivitetskrav-varsel.bekreft-feilmelding')}
                        </Normaltekst>
                    }
                />
            </div>

            <Alertstripe type={'feil'}>
                🤦‍♂️ Auda, vi har litt problemer med systemet for bekrefting av aktivitetskrav akkurat nå. Vennligst prøv igjen senere.
            </Alertstripe>

            <div className="knapperad">
                <Knapp type="hoved" spinner={isLoading} disabled={true}>
                    BEKREFT
                </Knapp>
            </div>
        </form>
    )
}

export default BekreftAktivitetskravSkjema
