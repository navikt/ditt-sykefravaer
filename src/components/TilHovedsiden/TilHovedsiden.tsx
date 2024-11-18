import { ReactElement } from 'react'
import { ChevronLeftIcon } from '@navikt/aksel-icons'
import { BodyShort, Link } from '@navikt/ds-react'

import { basePath } from '../../utils/environment'

function TilHovedsiden(): ReactElement {
    return (
        <Link href={basePath()} className="mt-8">
            <ChevronLeftIcon role="img" aria-hidden />
            <BodyShort>Til hovedsiden Ditt sykefravær</BodyShort>
        </Link>
    )
}

export default TilHovedsiden
