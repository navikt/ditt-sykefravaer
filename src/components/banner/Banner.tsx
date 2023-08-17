import { Heading } from '@navikt/ds-react'
import React from 'react'
import Image from 'next/image'

import Person from '../person/Person'

export const Banner = ({ tittel }: { tittel: string }) => {
    return (
        <header className="mt-4 flex items-center justify-between pb-8 ">
            <div className="flex">
                <div className="hidden md:mr-6 md:inline">
                    <Image src="/syk/sykefravaer/static/ditt-sykefravaer-ikon.svg" width={64} height={63} alt="" />
                </div>
                <Heading size="xlarge" level="1">
                    {tittel}
                </Heading>
            </div>
            <Person />
        </header>
    )
}
