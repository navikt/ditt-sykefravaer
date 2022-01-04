import { LenkepanelBase } from 'nav-frontend-lenkepanel'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React from 'react'

import { spinnsynUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

const UtbetalingAvSykepengerLenkepanel = () => {
    return (
        <LenkepanelBase href={spinnsynUrl()} border={true}>
            <div className="lenkeikon utbetaling">
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                        d="M14.41 27.5067C14.5667 27.6633 14.78 27.75 15 27.75H15.045C15.28 27.7367 15.5 27.6233 15.6483 27.44L36.4817 1.60665C36.7717 1.24832 36.715 0.723318 36.3567 0.434985C35.9983 0.144985 35.4733 0.201652 35.185 0.559985L14.9317 25.6717L7.255 17.995C6.93 17.67 6.40167 17.67 6.07667 17.995C5.75167 18.32 5.75167 18.8483 6.07667 19.1733L14.41 27.5067ZM0.833333 36.5H30.8333C31.2933 36.5 31.6667 36.1267 31.6667 35.6667V16.5C31.6667 16.04 31.2933 15.6667 30.8333 15.6667C30.3733 15.6667 30 16.04 30 16.5V34.8333H1.66667V6.49998H21.6667C22.1267 6.49998 22.5 6.12665 22.5 5.66665C22.5 5.20665 22.1267 4.83332 21.6667 4.83332H0.833333C0.373333 4.83332 0 5.20665 0 5.66665V35.6667C0 36.1267 0.373333 36.5 0.833333 36.5Z"
                        fill="#3E3832" />
                </svg>
            </div>
            <div className="bred-tekst-lenkepanel">
                <Undertittel tag="h3">
                    {tekst('lenker.utbetaling')}
                </Undertittel>
                <Normaltekst>{tekst('lenker.utbetaling.undertekst')}</Normaltekst>
            </div>
        </LenkepanelBase>
    )
}

export default UtbetalingAvSykepengerLenkepanel
