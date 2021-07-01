import { Systemtittel } from 'nav-frontend-typografi'
import React from 'react'

import useArbeidsrettetOppfolging from '../../query-hooks/useArbeidsrettetOppfolging'
import useDialogmoteBehov from '../../query-hooks/useDialogmoteBehov'
import useDialogmoter from '../../query-hooks/useDialogmoter'
import useOppfolgingsplaner from '../../query-hooks/useOppfolgingsplaner'
import useSoknader from '../../query-hooks/useSoknader'
import useSykmeldinger from '../../query-hooks/useSykmeldinger'
import useVedtak from '../../query-hooks/useVedtak'
import Vis from '../Vis'
import Aktivitetsplan from './Aktivitetsplan'
import Dialogmote from './Dialogmote'
import Oppfolgingsplan from './Oppfolgingsplan'
import { skalViseOppfoelgingsplanLenke } from './skalViseOppfoelgingsplanLenke'
import SoknadLenkepanel from './Soknader'
import SykmeldingLenkepanel from './Sykmelding'
import Tidslinjen from './Tidslinjen'
import UtbetalingAvSykepengerLenkepanel from './Utbetaling'

const Lenker = () => {
    const { data: arbeidsrettetOppfolging } = useArbeidsrettetOppfolging()
    const { data: vedtak } = useVedtak()
    const { data: sykmeldinger } = useSykmeldinger()
    const { data: soknader } = useSoknader()
    const { data: oppfolgingsplaner } = useOppfolgingsplaner()
    const { data: dialogmote } = useDialogmoter()
    const { data: dialogmoteBehov } = useDialogmoteBehov()

    const anyLenker = () => [
        arbeidsrettetOppfolging,
        vedtak,
        sykmeldinger,
        soknader,
        oppfolgingsplaner,
        dialogmote,
        dialogmoteBehov,
    ].find((data) =>
        data
    ) !== undefined

    return (
        <Vis hvis={anyLenker()}
            render={() =>
                <section className="lenker">
                    <Systemtittel tag="h2">Lenker</Systemtittel>
                    <Vis hvis={sykmeldinger && sykmeldinger.length > 0}
                        render={() =>
                            <SykmeldingLenkepanel />
                        }
                    />

                    <Vis hvis={soknader && soknader.length > 0}
                        render={() =>
                            <SoknadLenkepanel />
                        }
                    />

                    <Vis hvis={vedtak && vedtak.length > 0}
                        render={() =>
                            <UtbetalingAvSykepengerLenkepanel />
                        }
                    />

                    <Vis hvis={arbeidsrettetOppfolging?.underOppfolging}
                        render={() =>
                            <Aktivitetsplan />
                        }
                    />

                    <Vis hvis={skalViseOppfoelgingsplanLenke(sykmeldinger, oppfolgingsplaner)}
                        render={() =>
                            <Oppfolgingsplan />
                        }
                    />

                    <Vis hvis={dialogmoteBehov?.visMotebehov || dialogmote !== undefined}
                        render={() =>
                            <Dialogmote />
                        }
                    />
                    <Tidslinjen />

                </section>
            }
        />
    )
}

export default Lenker
