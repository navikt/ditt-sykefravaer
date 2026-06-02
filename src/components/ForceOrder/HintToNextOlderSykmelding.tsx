import { BodyLong, Button, GuidePanel } from '@navikt/ds-react'
import NextLink from 'next/link'
import { ReactElement, useEffect } from 'react'

import { toEarliestSykmelding, filterUnsentSykmeldinger } from '../../utils/findOlderSykmeldingId'
import useSykmeldinger from '../../hooks/sykmelding/useSykmeldinger'
import { pluralize } from '../../utils/stringUtils'
import { logUmamiEvent } from '../umami/umami'

function HintToNextOlderSykmelding(): ReactElement | null {
    const { data: alleSykmeldinger, error, isPending: isLoading } = useSykmeldinger()
    const unsentSykmeldinger = alleSykmeldinger != null ? filterUnsentSykmeldinger(alleSykmeldinger) : null
    const dontShowYet = isLoading || error || unsentSykmeldinger == undefined
    const isDone = unsentSykmeldinger?.length === 0

    useEffect(() => {
        if (dontShowYet) return
    }, [dontShowYet, isDone])

    if (dontShowYet || isDone) return null

    const earliest = unsentSykmeldinger.reduce(toEarliestSykmelding)
    const earliestId = earliest.id

    return (
        <GuidePanel poster className="mt-8">
            <BodyLong spacing>
                Du har {pluralize('sykmelding', unsentSykmeldinger.length)} du må velge om du skal bruke
            </BodyLong>
            <Button
                as={NextLink}
                href={`/sykmeldinger/${earliestId}`}
                variant="primary"
                onClick={() =>
                    logUmamiEvent({
                        eventName: 'navigere',
                        data: { destinasjon: 'neste ubrukte sykmelding', lenketekst: 'Gå til sykmeldingen' },
                    })
                }
            >
                {unsentSykmeldinger.length > 1 ? 'Gå videre' : 'Gå til sykmeldingen'}
            </Button>
        </GuidePanel>
    )
}

export default HintToNextOlderSykmelding
