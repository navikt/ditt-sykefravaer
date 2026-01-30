import { Page } from '@navikt/ds-react'
import React, { JSX } from 'react'

import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../hooks/useBreadcrumbs'

function ServerError(): JSX.Element | boolean {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.serverError())

    return (
        <Page>
            <Page.Block width="xl">
                <h1>Det oppsto en uventet feil</h1>
            </Page.Block>
        </Page>
    )
}

export default ServerError
