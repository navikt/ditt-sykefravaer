import React from 'react'

const Vis = (props: { hvis: undefined | null | boolean | string; children: React.ReactNode }) => {
    return props.hvis === undefined || props.hvis === null || !props.hvis || props.hvis === ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (null as any)
        : props.children
}

export default Vis
