import './radiofaner.less'

import Hjelpetekst from 'nav-frontend-hjelpetekst'
import React from 'react'
import Vis from '../Vis'

interface Alternativ {
    verdi: string;
    tittel: string;
    hjelpetekst?: string;
}

interface RadiofaneProps {
    alternativer: Alternativ[];
    changeHandler: () => void;
    valgtAlternativ: string;
    className: string;
    radioName: string;
}

const Radiofaner = ({ alternativer, valgtAlternativ, changeHandler, className, radioName }: RadiofaneProps) => {

    return (
        <ul className={`radiofaner ${className}`}>
            {alternativer.map((a, index) => {
                const erValgt = a.verdi === valgtAlternativ
                const divClassname = a.hjelpetekst ? 'medHjelpetekst' : ''
                const inputId = `radio-${a.verdi}`
                return (
                    <li className="skjemaelement" key={index}>
                        <div className={divClassname}>
                            <input type="radio" name={radioName}
                                className={`skjemaelement__input radioknapp js-${a.verdi}`}
                                value={a.verdi}
                                id={inputId}
                                checked={erValgt}
                                onChange={() => {
                                    changeHandler(a.verdi)
                                }}
                            />
                            <label className="skjemaelement__label" htmlFor={inputId}>{a.tittel}</label>
                            <Vis hvis={a.hjelpetekst}
                                render={() => {
                                    return <Hjelpetekst id="velg-arbeidssituasjon">{a.hjelpetekst}</Hjelpetekst>
                                }}
                            />
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default Radiofaner
