import { LenkepanelBase } from 'nav-frontend-lenkepanel'
import { Undertittel } from 'nav-frontend-typografi'
import React from 'react'

import { tekst } from '../../utils/tekster'

export default () => {
    return (
        <LenkepanelBase href={tekst('lenker.tidslinjen.url')} border={true}>
            <div className="lenkeikon">
                <svg width="32" height="28" viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#3E3832" fill="none" fillRule="evenodd">
                        <circle cx="3.351" cy="3.429" r="2.667" />
                        <path d="M11.443 3.333H31.35" />
                        <ellipse cx="3.351" cy="14.096" rx="2.667" ry="2.667" />
                        <path d="M11.443 14H31.35" />
                        <ellipse cx="3.351" cy="24.763" rx="2.667" ry="2.667" />
                        <path d="M11.443 24.665H31.35" />
                    </g>
                </svg>
            </div>
            <Undertittel tag="h2">
                {tekst('lenker.tidslinjen')}
            </Undertittel>
        </LenkepanelBase>
    )
}

