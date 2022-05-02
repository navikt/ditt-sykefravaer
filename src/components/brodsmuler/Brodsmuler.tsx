import { OppChevron } from 'nav-frontend-chevron'
import Lenke from 'nav-frontend-lenker'
import { Normaltekst } from 'nav-frontend-typografi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import { dittNavUrl } from '../../utils/environment'
import Vis from '../Vis'
import Person from './Person'

const LITEN = 768

export interface Brodsmule {
    sti: string
    tittel: string
    mobilTittel?: string
    erKlikkbar?: boolean
}

const faste = (sykefravaerKlikkbar: boolean): Brodsmule[] => {
    return [
        { tittel: 'Ditt NAV', sti: dittNavUrl(), erKlikkbar: true },
        { tittel: 'Ditt sykefravær', sti: '/', erKlikkbar: sykefravaerKlikkbar }
    ]
}

const BrodsmuleBit = ({ sti, tittel, erKlikkbar }: Brodsmule) => {
    const erEkstern = sti && (sti.startsWith('https://') || sti.startsWith('http://'))
    const router = useRouter()

    const klikker = (e: any, sti: string) => {
        e.preventDefault()
        router.push(sti)
    }

    const link = erEkstern
        ? <Lenke href={sti}>{tittel}</Lenke>
        : sti
            ? <Link href={sti}><a className="lenke" onClick={e => klikker(e, sti)}>{tittel}</a></Link>
            : <span>{tittel}</span>

    if (!erKlikkbar) {
        return (
            <li className="smule">
                <span className="vekk">Du er her:</span>
                <span>{tittel}</span>
            </li>
        )
    } else if (erKlikkbar) {
        return (
            <li className="smule">{link}</li>
        )
    }
    return (
        <li className="smule">
            <span>{tittel}</span>
        </li>
    )
}

interface BrodsmulerProps {
    brodsmuler: Brodsmule[];
}

const Brodsmuler = ({ brodsmuler }: BrodsmulerProps) => {
    const [ synlige, setSynlige ] = useState<Brodsmule[]>([])
    const [ skjerm, setSkjerm ] = useState<number>()
    const smulesti = useRef<HTMLElement>(null)
    const sykefravaerKlikkbar = brodsmuler.length > 0

    brodsmuler = faste(sykefravaerKlikkbar).concat(brodsmuler)

    useEffect(() => {
        setSkjerm(window.innerWidth)
    }, [])

    useEffect(() => {
        window.addEventListener('resize', () => {
            setSkjerm(window.innerWidth)
        })
        setSynlige(skjerm! <= LITEN ? [ brodsmuler[ brodsmuler.length - 1 ] ] : brodsmuler)
        // eslint-disable-next-line
    }, [skjerm])

    const toggleSynlige = () => {
        if (synlige.length === brodsmuler.length) {
            setSynlige([ brodsmuler[ brodsmuler.length - 1 ] ])
            smulesti.current?.classList.remove('apen')
        } else {
            setSynlige(brodsmuler)
            smulesti.current?.classList.add('apen')
        }
    }

    return (
        <nav className="brodsmuler" ref={smulesti} aria-label="Du er her: ">
            <div className="limit">
                <Person />
                <Normaltekst tag="ul" className="brodsmuler__smuler">
                    <Vis hvis={skjerm! <= LITEN}
                        render={() =>
                            <li className="smule">
                                <button
                                    aria-label={
                                        synlige.length === brodsmuler.length
                                            ? 'Vis redusert brødsmulesti'
                                            : 'Vis hele brødsmulestien'}
                                    className="js-toggle"
                                    onClick={toggleSynlige}
                                >
                                ...
                                </button>
                            </li>
                        }
                    />

                    {synlige.map((smule, index) => {
                        return (
                            <BrodsmuleBit key={index}
                                sti={smule.sti}
                                tittel={
                                    skjerm! <= LITEN && smule.mobilTittel && !smulesti.current?.classList.contains('apen')
                                        ? smule.mobilTittel
                                        : smule.tittel
                                }
                                erKlikkbar={smule.erKlikkbar}
                            />
                        )
                    })}
                </Normaltekst>
                <button
                    aria-label={
                        synlige.length === brodsmuler.length
                            ? 'Vis redusert brødsmulesti'
                            : 'Vis hele brødsmulestien'}
                    className="js-toggle"
                    onClick={toggleSynlige}
                >
                    <OppChevron />
                </button>
            </div>
        </nav>
    )
}

export default Brodsmuler
