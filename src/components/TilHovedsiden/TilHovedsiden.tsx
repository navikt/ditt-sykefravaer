import { ReactElement } from 'react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useRouter } from 'next/router'

import { basePath } from '../../utils/environment'
import { UseTestpersonQuery } from '../../hooks/useTestpersonQuery'

function TilHovedsiden(): ReactElement {
    const router = useRouter()
    const testpersonQuery = UseTestpersonQuery()

    return (
        <Button
            icon={<ArrowLeftIcon aria-hidden />}
            variant="secondary"
            as="a"
            href={basePath() + testpersonQuery.query()}
            className="mt-8"
            onClick={(e) => {
                e.preventDefault()
                router.push('/' + testpersonQuery.query())
            }}
        >
            Tilbake til Ditt sykefravær
        </Button>
    )
}

export default TilHovedsiden
