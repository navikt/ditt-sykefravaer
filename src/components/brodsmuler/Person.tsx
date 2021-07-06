import Popover, { PopoverOrientering } from 'nav-frontend-popover'
import React, { useRef, useState } from 'react'

import { personas } from '../../data/mock'
import env from '../../utils/environment'
import Vis from '../Vis'
import personIkon from './person.svg'

const Person = () => {
    const [ visInnhold, setVisInnhold ] = useState<boolean>(false)
    const person = useRef<HTMLImageElement>(null)
    const kanVelgePerson = (env.isMockBackend || env.isOpplaering)

    if (kanVelgePerson) {
        person?.current?.addEventListener('click', () => {
            setVisInnhold(!visInnhold)
        })
    }

    return (
        <>
            <img src={personIkon} alt="Du" className="brodsmuler__ikon" ref={person} />
            <Vis hvis={kanVelgePerson && visInnhold}
                render={() =>
                    <Popover
                        ankerEl={person.current as HTMLElement}
                        orientering={PopoverOrientering.Under}
                        onRequestClose={() => setVisInnhold(false)}
                    >
                        <ul style={{ minWidth: 190 }}>
                            {Object.keys(personas).map((p, idx) =>
                                <li key={idx}>
                                    <a href={`?testperson=${p}`}>{p}</a>
                                </li>
                            )}
                        </ul>
                    </Popover>
                }
            />
        </>
    )
}

export default Person
