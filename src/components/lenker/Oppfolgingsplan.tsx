import React from 'react'
import { HandshakeIcon } from '@navikt/aksel-icons'
import { Skeleton } from '@navikt/ds-react'

import { oppfolgingsplanUrl } from '../../utils/environment'
import { tekst } from '../../utils/tekster'
import useSykmeldinger from '../../hooks/useSykmeldinger'
import useOppfolgingsplaner from '../../hooks/useOppfolgingsplaner'

import { FellesLenkepanel } from './FellesLenkepanel'
import { skalViseOppfoelgingsplanLenke } from './skalViseOppfoelgingsplanLenke'

const Oppfolgingsplan = () => {
    const { data: sykmeldinger, isLoading: sykmeldingerLaster } = useSykmeldinger()
    const { data: oppfolgingsplaner, isLoading: oppfolginsplanerLaster } = useOppfolgingsplaner()

    if (sykmeldingerLaster || oppfolginsplanerLaster) {
        return <Skeleton variant="rectangle" height="86px" className="mb-2" />
    }

    if (skalViseOppfoelgingsplanLenke(sykmeldinger, oppfolgingsplaner)) {
        return (
            <FellesLenkepanel
                ikon={HandshakeIcon}
                url={oppfolgingsplanUrl()}
                tekst={tekst('lenker.oppfolgingsplan')}
                undertekst={tekst('lenker.oppfolgingsplan.undertekst')}
            />
        )
    }
    return null
}

export default Oppfolgingsplan
