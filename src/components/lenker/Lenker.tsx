import { Heading } from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'

import useArbeidsrettetOppfolging from '../../hooks/useArbeidsrettetOppfolging'
import useOppfolgingsplaner from '../../hooks/useOppfolgingsplaner'
import useSoknader from '../../hooks/useSoknader'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import useVedtak from '../../hooks/useVedtak'
import Vis from '../Vis'

import Aktivitetsplan from './Aktivitetsplan'
import { DialogmoteLenke } from './Dialogmote'
import Oppfolgingsplan from './Oppfolgingsplan'
import { skalViseOppfoelgingsplanLenke } from './skalViseOppfoelgingsplanLenke'
import SoknadLenkepanel from './Soknader'
import SykmeldingLenkepanel from './Sykmelding'
import UtbetalingAvSykepengerLenkepanel from './Utbetaling'

const Lenker = () => {
    const [lenker, setLenker] = useState<boolean>()

    const { data: arbeidsrettetOppfolging } = useArbeidsrettetOppfolging()
    const { data: vedtak } = useVedtak()
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()
    const { data: oppfolgingsplaner } = useOppfolgingsplaner()

    useEffect(() => {
        const anyLenker = () =>
            [arbeidsrettetOppfolging, vedtak, sykmeldinger, soknader, oppfolgingsplaner].find((data) => data) !==
            undefined
        setLenker(anyLenker())
    }, [arbeidsrettetOppfolging, oppfolgingsplaner, soknader, sykmeldinger, vedtak])

    return (
        <Vis
            hvis={lenker}
            render={() => (
                <section className="lenker">
                    <Heading size="medium" level="2" className="invisible w-0 h-0">
                        Lenker
                    </Heading>
                    <Vis hvis={sykmeldinger && sykmeldinger.length > 0} render={() => <SykmeldingLenkepanel />} />

                    <Vis hvis={soknader && soknader.length > 0} render={() => <SoknadLenkepanel />} />

                    <Vis hvis={vedtak && vedtak.length > 0} render={() => <UtbetalingAvSykepengerLenkepanel />} />

                    <Vis hvis={arbeidsrettetOppfolging?.erUnderOppfolging} render={() => <Aktivitetsplan />} />

                    <Vis
                        hvis={skalViseOppfoelgingsplanLenke(sykmeldinger, oppfolgingsplaner)}
                        render={() => <Oppfolgingsplan />}
                    />
                    <DialogmoteLenke />
                </section>
            )}
        />
    )
}

export default Lenker
