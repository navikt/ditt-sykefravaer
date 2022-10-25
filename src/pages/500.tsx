import { ContentContainer } from '@navikt/ds-react'
import React from 'react'

import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'

function ServerError(): JSX.Element | boolean {
    useUpdateBreadcrumbs(() => [{ title: 'Ukjent feil' }])

    return (
        <ContentContainer>
            <h1>Det oppsto en uventet feil</h1>
        </ContentContainer>
    )
}

export default ServerError
