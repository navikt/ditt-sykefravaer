import React, { PropsWithChildren } from 'react'

export const PageWrapper = ({ children }: PropsWithChildren): JSX.Element => {
    return <div className="custom-width pb-custom-padding mx-auto my-0 max-w-full p-4">{children}</div>
}
