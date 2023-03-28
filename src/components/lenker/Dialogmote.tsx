import React from 'react'

import { dialogmoteUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'

export function DialogmoteLenke() {
    const ikon = <img className="max-w-none" src="/syk/sykefravaer/static/calender.svg" alt="Dialogmoter" />

    return <FellesLenkepanel ikon={ikon} url={dialogmoteUrl()} tekst={tekst('lenker.dialogmoter')} />
}
