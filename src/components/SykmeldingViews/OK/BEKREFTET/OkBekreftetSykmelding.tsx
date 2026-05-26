import React, { ReactElement, useState } from 'react'
import { Alert, BodyShort, Button, Heading } from '@navikt/ds-react'
import { PencilWritingIcon } from '@navikt/aksel-icons'

import { Sykmelding } from '../../../../types/sykmelding/sykmelding'
import { finnOptInFrist } from '../../../../utils/sykmeldingUtils'
import StatusBanner from '../../../StatusBanner/StatusBanner'
import SykmeldingSykmeldtSection from '../../../Sykmelding/SykmeldingerSykmeldt/SykmeldingSykmeldtSection'
import { ArbeidssituasjonType } from '../../../../types/sykmelding/sykmeldingCommon'
import { VentetidInfo } from '../../../SykmeldingVentetid/VentetidInfo'

interface OkBekreftetSykmeldingProps {
    sykmelding: Sykmelding
    reopen: () => void
}

function OkBekreftetSykmelding({ sykmelding, reopen }: OkBekreftetSykmeldingProps): ReactElement {
    const [optInSuksess, setOptInSuksess] = useState(false)
    const optInFrist = finnOptInFrist(sykmelding)
    return (
        <div className="sykmelding-container">
            {optInSuksess && (
                <div className="mb-4">
                    <Alert variant="info" role="status">
                        <Heading size="small" level="3" spacing>
                            Vi oppretter søknad etter sykmeldingsperioden er over
                        </Heading>
                        <BodyShort>
                            Du vil få beskjed av oss når du skal fylle ut og sende inn søknaden om sykepenger for
                            sykmeldingsperioden.
                        </BodyShort>
                    </Alert>
                </div>
            )}
            <div className="mb-4">
                <StatusBanner
                    sykmeldingStatus={sykmelding.sykmeldingStatus}
                    behandlingsutfall={sykmelding.behandlingsutfall}
                    egenmeldt={sykmelding.egenmeldt}
                />
            </div>

            {!(sykmelding.egenmeldt != null && sykmelding.egenmeldt) && (
                <div className="mb-8">
                    <div className="mb-4">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => {
                                reopen()
                            }}
                            icon={<PencilWritingIcon aria-hidden />}
                        >
                            GJØR UTFYLLINGEN PÅ NYTT
                        </Button>
                    </div>
                </div>
            )}

            {(sykmelding.sykmeldingStatus.brukerSvar?.arbeidssituasjon.svar === ArbeidssituasjonType.NAERINGSDRIVENDE ||
                sykmelding.sykmeldingStatus.brukerSvar?.arbeidssituasjon.svar === ArbeidssituasjonType.FRILANSER) && (
                <div className="mb-8">
                    <VentetidInfo
                        sykmeldingId={sykmelding.id}
                        optInFrist={optInFrist}
                        onOptInSuccess={() => setOptInSuksess(true)}
                    />
                </div>
            )}

            <SykmeldingSykmeldtSection sykmelding={sykmelding} />
        </div>
    )
}

export default OkBekreftetSykmelding
