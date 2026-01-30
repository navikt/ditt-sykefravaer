import { Page } from '@navikt/ds-react'
import React, { JSX, useEffect } from 'react'

import { useUpdateBreadcrumbs, breadcrumbBuilders } from '../hooks/useBreadcrumbs'

function NotFound(): JSX.Element | boolean {
    useUpdateBreadcrumbs(() => breadcrumbBuilders.notFound())

    useEffect(() => {
        if (window.location.pathname === '/') {
            window.location.pathname = '/syk/sykefravaer'
        }
        if (!window.location.pathname.startsWith('/syk/sykefravaer')) {
            window.location.pathname = '/syk/sykefravaer'
        }
    }, [])

    return (
        <Page>
            <Page.Block width="xl">
                <h1>Fant ikke siden</h1>
            </Page.Block>
        </Page>
    )
}

export default NotFound
