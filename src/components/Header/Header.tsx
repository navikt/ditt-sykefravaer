import { BodyLong, Heading, Skeleton } from '@navikt/ds-react'
import React, { ReactElement } from 'react'

import Person from '../person/Person'
import { isMockBackend, isOpplaering } from '../../utils/environment'

type HeaderNormalProps = {
    title: string
    subTitle?: string
}

type HeaderSkeletonProps = {
    skeleton: true
}

export type HeaderProps = HeaderNormalProps | HeaderSkeletonProps

function Header(props: HeaderProps): ReactElement {
    const kanVelgePerson = isMockBackend() || isOpplaering()

    return (
        <div className="mt-4 flex items-center justify-between pb-8 ">
            <div>
                {!('skeleton' in props) ? (
                    <Heading level="1" size="xlarge">
                        {props.title ?? 'Sykmelding'}
                    </Heading>
                ) : (
                    <Skeleton>
                        <Heading level="1" size="xlarge">
                            Sykmelding
                        </Heading>
                    </Skeleton>
                )}
                {!('skeleton' in props) ? (
                    props.subTitle ? (
                        <BodyLong className="font-bold text-2xl">{props.subTitle}</BodyLong>
                    ) : null
                ) : (
                    <Skeleton>
                        <BodyLong className="font-bold text-2xl">X. - XX. XXXX</BodyLong>
                    </Skeleton>
                )}
            </div>
            {kanVelgePerson && <Person side="sykmelding" />}
        </div>
    )
}

export default Header
