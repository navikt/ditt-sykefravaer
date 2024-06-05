import React from 'react'

import Aktivitetsplan from './Aktivitetsplan'
import { DialogmoteLenke } from './Dialogmote'
import Oppfolgingsplan from './Oppfolgingsplan'
import SoknadLenkepanel from './Soknader'
import SykmeldingLenkepanel from './Sykmelding'
import UtbetalingAvSykepengerLenkepanel from './Utbetaling'
import { InntektsmeldingLenkepanel } from './InntektsmeldingLenkepanel'
import { BeOmMerOppfolging } from './BeOmMerOppfolging'

const Lenker = () => {
    return (
        <section className="my-8" aria-label="Lenker">
            <SykmeldingLenkepanel />
            <SoknadLenkepanel />
            <InntektsmeldingLenkepanel />
            <UtbetalingAvSykepengerLenkepanel />
            <Oppfolgingsplan />
            <DialogmoteLenke />
            <Aktivitetsplan />
            <BeOmMerOppfolging />
        </section>
    )
}

export default Lenker
