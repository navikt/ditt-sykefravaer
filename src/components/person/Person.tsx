import { Link, Popover } from '@navikt/ds-react'
import React, { useRef, useState } from 'react'

import { personas } from '../../data/mock/testperson'
import { isMockBackend, isOpplaering } from '../../utils/environment'
import Vis from '../Vis'

const Person = () => {
    const [open, setOpen] = useState<boolean>(false)
    const person = useRef<HTMLImageElement>(null)
    const kanVelgePerson = isMockBackend() || isOpplaering()

    if (!kanVelgePerson) return null

    return (
        <div className="hidden cursor-pointer md:block">
            <button
                aria-label="Velg person"
                onClick={() => {
                    setOpen(!open)
                }}
            >
                <img src="/syk/sykefravaer/static/person.svg" className="h-8 w-8" ref={person} alt="" />
            </button>
            <Vis
                hvis={open}
                render={() => (
                    <Popover
                        open={open}
                        anchorEl={person.current as HTMLElement}
                        placement="bottom"
                        onClose={() => setOpen(false)}
                    >
                        <Popover.Content>
                            <ul>
                                {Object.keys(personas).map((p, idx) => (
                                    <li key={idx}>
                                        <Link href={`?testperson=${p}`}>{p}</Link>
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
