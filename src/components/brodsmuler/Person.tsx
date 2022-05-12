import { Popover } from '@navikt/ds-react'
import React, { useRef, useState } from 'react'

import { personas } from '../../data/mock/testperson'
import { isMockBackend, isOpplaering } from '../../utils/environment'
import Vis from '../Vis'

const Person = () => {
    const [ visInnhold, setVisInnhold ] = useState<boolean>(false)
    const person = useRef<HTMLImageElement>(null)
    const kanVelgePerson = isMockBackend() || isOpplaering()

    if (kanVelgePerson) {
        person?.current?.addEventListener('click', () => {
            setVisInnhold(!visInnhold)
        })
    }

    return (
        <>
            <img src="/syk/sykefravaer/static/person.svg"
                alt="Du"
                className="brodsmuler__ikon"
                ref={person}
            />
            <Vis
                hvis={kanVelgePerson && visInnhold}
                render={() => (
                    <Popover
                        open={true}
                        anchorEl={person.current as HTMLElement}
                        placement="bottom"
                        onClose={() => setVisInnhold(false)}
                    >
                        <Popover.Content>
                            <ul style={{ minWidth: 190 }}>
                                {Object.keys(personas).map((p, idx) => (
                                    <li key={idx}>
                                        <a href={`?testperson=${p}`}>{p}</a>
                                    </li>
                                ))}
                            </ul>
                        </Popover.Content>
                    </Popover>
                )}
            />
        </>
    )
}

export default Person
