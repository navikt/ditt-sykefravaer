import { BodyShort, Button } from '@navikt/ds-react'
import React, { SyntheticEvent, useState } from 'react'

import useBekreftAktivitetskrav from '../../query-hooks/useBekreftAktivitetskrav'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'

const BekreftAktivitetskravSkjema = () => {
    const [check, setCheck] = useState<boolean>(false)
    const [buttonClicked, setButtonClicked] = useState<boolean>(false)
    const { mutate: bekreft, isLoading } = useBekreftAktivitetskrav()

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
        setButtonClicked(true)
        if (check) bekreft()
    }

    return (
        <form onSubmit={handleSubmit} className="bekreft-aktivitetskrav">
            <div className="navds-checkbox navds-checkbox--medium">
                <input
                    id="bekreftAktivitetskrav"
                    type="checkbox"
                    className="navds-checkbox__input"
                    onChange={(e) => setCheck(e.currentTarget.checked)}
                />
                <label
                    className="navds-checkbox__label"
                    htmlFor="bekreftAktivitetskrav"
                >
                    <BodyShort as="span">
                        {tekst('aktivitetskrav-varsel.bekreft-label')}
                    </BodyShort>
                </label>
                <Vis
                    hvis={!check && buttonClicked}
                    render={() => (
                        <BodyShort className="typo-feilmelding">
                            {tekst('aktivitetskrav-varsel.bekreft-feilmelding')}
                        </BodyShort>
                    )}
                />
            </div>

            <div className="knapperad">
                <Button variant="primary" loading={isLoading}>
                    BEKREFT
                </Button>
            </div>
        </form>
    )
}

export default BekreftAktivitetskravSkjema
