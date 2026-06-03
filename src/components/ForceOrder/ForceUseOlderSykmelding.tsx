import { ReactElement } from 'react'
import { BodyLong, Box, Button, GuidePanel, Heading, ReadMore } from '@navikt/ds-react'
import NextLink from 'next/link'

import { pluralize } from '../../utils/stringUtils'
import { logEvent } from '../umami/umami'

interface Props {
    olderSykmeldingId: string
    olderSykmeldingCount: number
}

function ForceUseOlderSykmelding({ olderSykmeldingId, olderSykmeldingCount }: Props): ReactElement {
    return (
        <GuidePanel poster>
            <Heading level="2" size="small">
                Før du kan begynne
            </Heading>
            Du har {pluralize('sykmelding', olderSykmeldingCount)} du må velge om du skal bruke, før du kan bruke denne.
            <Box marginBlock="space-16 space-24">
                <ReadMore header="Hvorfor må jeg gjøre dette?">
                    <>
                        <BodyLong spacing>
                            Andre sykmeldingsperioder kan påvirke beløpet du skal få utbetalt for denne perioden.
                        </BodyLong>
                        <BodyLong>
                            Derfor må vi be deg om å velge om du skal bruke de sykmeldingene du har liggende, før du kan
                            begynne på denne.
                        </BodyLong>
                    </>
                </ReadMore>
            </Box>
            <Button
                as={NextLink}
                href={`/sykmeldinger/${olderSykmeldingId}`}
                variant="primary"
                onClick={() =>
                    logEvent('navigere', {
                        destinasjon: 'neste ubrukte sykmelding (tvungen)',
                        lenketekst: 'Gå til sykmeldingen',
                    })
                }
            >
                {olderSykmeldingCount > 1 ? 'Gå videre' : 'Gå til sykmeldingen'}
            </Button>
        </GuidePanel>
    )
}

export default ForceUseOlderSykmelding
