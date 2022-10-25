import { Popover } from '@navikt/ds-react'
import React, { useRef, useState } from 'react'

import { personas } from '../../data/mock/testperson'
import { isMockBackend, isOpplaering } from '../../utils/environment'
import Vis from '../Vis'

const Person = () => {
    const [open, setOpen] = useState<boolean>(false)
    const person = useRef<HTMLImageElement>(null)
    const kanVelgePerson = isMockBackend() || isOpplaering()

    return (
        <div className="person">
            <button
                aria-label="Velg person"
                className="lenkeknapp"
                onClick={() => {
                    setOpen(!open)
                }}
            >
                <img src="/syk/sykefravaer/static/person.svg" className="person__ikon" ref={person} alt="" />
            </button>
            <Vis
                hvis={kanVelgePerson && open}
                render={() => (
                    <Popover
                        open={!open}
                        anchorEl={person.current as HTMLElement}
                        placement="bottom"
                        onClose={() => setOpen(false)}
                    >
                        <Popover.Content>
                            <ul>
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
        </div>
    )
}

export default Person
