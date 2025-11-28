import { ReactElement } from 'react'
import { BodyLong, Button, GuidePanel, Heading, ReadMore } from '@navikt/ds-react'
import Link from 'next/link'

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
            <div className="mb-6 mt-4">
                <ReadMore header="Hvorfor må jeg gjøre dette?">
                    <div>
                        <BodyLong spacing>
                            Andre sykmeldingsperioder kan påvirke beløpet du skal få utbetalt for denne perioden.
                        </BodyLong>
                        <BodyLong>
                            Derfor må vi be deg om å velge om du skal bruke de sykmeldingene du har liggende, før du kan
                            begynne på denne.
                        </BodyLong>
                    </div>
                </ReadMore>
            </div>
            <Link href={`/sykmeldinger/${olderSykmeldingId}`} passHref>
                <Button
                    as="a"
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
            </Link>
        </GuidePanel>
    )
}

export default ForceUseOlderSykmelding
