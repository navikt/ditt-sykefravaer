import { LenkepanelBase } from 'nav-frontend-lenkepanel'
import { Undertittel } from 'nav-frontend-typografi'
import React from 'react'

import environment from '../../utils/environment'
import { tekst } from '../../utils/tekster'

export default () => {
    return (
        <LenkepanelBase href={environment.dialogmoteUrl} border={true}>
            <div className="lenkeikon">
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#3E3832" fill="none" fillRule="evenodd">
                        <path d="M6 3.333H.667v28h30.666v-28H26" />
                        <path d="M6 .667h4V6H6V.667zm16 0h4V6h-4V.667zM10 3.333h12-12zM.667 10h30.666H.667z" />
                    </g>
                </svg>
            </div>
            <Undertittel tag="h3">
                {tekst('lenker.dialogmoter')}
            </Undertittel>
        </LenkepanelBase>
    )
}

