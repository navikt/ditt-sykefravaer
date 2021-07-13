import './detteHarSkjedd.less'

import dayjs from 'dayjs'
import Panel from 'nav-frontend-paneler'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import React from 'react'
import { Link } from 'react-router-dom'

import Hake from '../../grafikk/hake.svg'
import useHendelser from '../../query-hooks/useHendelser'
import { tekst } from '../../utils/tekster'
import Vis from '../Vis'

const DetteHarSkjedd = () => {

    const { data: hendelser } = useHendelser()
    const bekreftetHendelser = hendelser?.filter(h => h.type === 'AKTIVITETSKRAV_BEKREFTET')

    return (
        <Vis hvis={bekreftetHendelser && bekreftetHendelser.length > 0}
            render={() =>
                <Panel className="dette-har-skjedd" border>
                    <img src={Hake} alt="" />
                    <div>
                        <Undertittel>{tekst('detteHarSkjedd.lenkepanel.tekst')}</Undertittel>
                        <Link to={tekst('detteHarSkjedd.lenkepanel.url')}>
                            <Normaltekst tag="span">
                                {tekst('detteHarSkjedd.lenkepanel.bekreftet')}
                                {bekreftetHendelser?.map((h) => {
                                    return dayjs(h.inntruffetdato).format('DD.MM.YYYY')
                                }).join(', ') || ''}
                            </Normaltekst>
                        </Link>
                    </div>
                </Panel>
            }
        />
    )
}

export default DetteHarSkjedd
