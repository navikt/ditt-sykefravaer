import { Heading } from '@navikt/ds-react'
import React from 'react'
import Image from 'next/image'

import Person from '../person/Person'
import { isMockBackend, isOpplaering } from '../../utils/environment'

export const Banner = ({ tittel, utenIkon }: { tittel: string; utenIkon?: boolean }) => {
    const kanVelgePerson = isMockBackend() || isOpplaering()

    return (
        <header className="mt-4 flex items-center justify-between pb-8 ">
            <div className="flex">
                {!utenIkon && (
                    <div className="hidden md:mr-6 md:inline">
                        <Image src="/syk/sykefravaer/static/ditt-sykefravaer-ikon.svg" width={64} height={63} alt="" />
                    </div>
                )}
                <Heading size="xlarge" level="1">
                    {tittel}
                </Heading>
            </div>
            {kanVelgePerson && <Person />}
        </header>
    )
}
