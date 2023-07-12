import React from 'react'
import { CalendarIcon } from '@navikt/aksel-icons'

import { dialogmoteUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'

import { FellesLenkepanel } from './FellesLenkepanel'
export function DialogmoteLenke() {
    return <FellesLenkepanel ikon={CalendarIcon} url={dialogmoteUrl()} tekst={tekst('lenker.dialogmoter')} />
}
