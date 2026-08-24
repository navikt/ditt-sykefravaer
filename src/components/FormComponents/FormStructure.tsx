import { ReactElement, PropsWithChildren } from 'react'
import { Heading, HeadingProps } from '@navikt/ds-react'
import { cn } from '../../utils/tw-utils'

type QuestionWrapperProps = PropsWithChildren<{
    className?: string
}>

export function QuestionWrapper({ children, className }: QuestionWrapperProps): ReactElement {
    return <div className={cn('mt-12', className)}>{children}</div>
}

type SectionWrapperProps = Partial<Pick<HeadingProps, 'size' | 'level'>> & {
    title?: string
}

export function SectionWrapper({
    children,
    title,
    size = 'medium',
    level = '2',
}: PropsWithChildren<SectionWrapperProps>): ReactElement {
    return (
        <section className="mt-6" aria-label={title}>
            {title && (
                <Heading size={size} level={level}>
                    {title}
                </Heading>
            )}
            {children}
        </section>
    )
}
