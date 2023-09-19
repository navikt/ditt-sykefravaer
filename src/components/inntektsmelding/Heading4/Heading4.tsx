import { Heading, HeadingProps } from '@navikt/ds-react'
import classNames from 'classnames/bind'

import styles from './Heading4.module.css'

interface Heading4Props extends Partial<HeadingProps> {
    topPadded?: boolean
}

const cx = classNames.bind(styles)

export default function Heading4(props: Heading4Props) {
    const className = cx('heading', props.className, { heading_top: props.topPadded })

    return (
        <Heading size="medium" level="4" className={className}>
            {props.children}
        </Heading>
    )
}
