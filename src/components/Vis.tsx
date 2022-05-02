import React from 'react'

interface VisProps {
    hvis: undefined | null | boolean | string
    render: () => React.ReactNode
}

const Vis = ({ hvis, render }: VisProps) => {
    return hvis
        ? render()
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (null as any)
}

export default Vis
