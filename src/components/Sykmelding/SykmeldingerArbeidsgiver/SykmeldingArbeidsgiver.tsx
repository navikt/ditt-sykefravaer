import { ReactElement } from 'react'
import * as R from 'remeda'

import { Sykmelding } from '../../../types/sykmelding/sykmelding'
import { getSykmeldingperioderSorted } from '../../../utils/periodeUtils'
import { finnEgenmeldingsdager } from '../../../utils/egenmeldingsdagerUtils'

import Perioder from './Felles/Perioder'
import SykmeldingenGjelder from './Felles/SykmeldingenGjelder'
import Arbeidsevne from './Nasjonal/Arbeidsevne'
import MeldingTilArbeidsgiverView from './Nasjonal/MeldingTilArbeidsgiver'
import AktivitetIkkeMulig from './Nasjonal/AktivitetIkkeMulig'
import Tilbakedatering from './Nasjonal/Tilbakedatering'
import PrognoseView from './Nasjonal/PrognoseView'
import Diagnoser from './Nasjonal/Diagnoser'
import AnnenInfo from './Nasjonal/AnnenInfo'

interface SykmeldingviewProps {
    sykmelding: Sykmelding
    chosenEgenmeldingsdager?: string[]
}

const sectionId = 'sykmelding-arbeidsgiver'

function SykmeldingArbeidsgiver({ sykmelding, chosenEgenmeldingsdager }: SykmeldingviewProps): ReactElement {
    return (
        <div className="md:p-4 pt-0">
            <SykmeldingenGjelder pasient={sykmelding.pasient} parentId={sectionId} />
            <Perioder
                perioder={getSykmeldingperioderSorted(sykmelding.sykmeldingsperioder)}
                egenmeldingsdager={
                    chosenEgenmeldingsdager ?? finnEgenmeldingsdager(sykmelding.sykmeldingStatus.brukerSvar)
                }
                parentId={sectionId}
            />
            <AnnenInfo sykmelding={sykmelding} parentId={sectionId} />
            {sykmelding.medisinskVurdering?.hovedDiagnose && sykmelding.medisinskVurdering.biDiagnoser.length > 0 && (
                <Diagnoser medisinskVurdering={sykmelding.medisinskVurdering} parentId={sectionId} />
            )}
            {R.pipe(
                sykmelding.sykmeldingsperioder,
                R.map(R.prop('aktivitetIkkeMulig')),
                R.filter(R.isTruthy),
                R.map((it, index) => (
                    <AktivitetIkkeMulig
                        key={
                            it.arbeidsrelatertArsak?.arsak.join('-') ?? it.medisinskArsak?.arsak.join('-') ?? 'unknown'
                        }
                        aktivitetIkkeMulig={it}
                        parentId={`${sectionId}-${index}`}
                    />
                )),
            )}
            <PrognoseView prognose={sykmelding.prognose} parentId={sectionId} />
            <Arbeidsevne tiltakArbeidsplassen={sykmelding.tiltakArbeidsplassen} parentId={sectionId} />
            <MeldingTilArbeidsgiverView
                meldingTilArbeidsgiver={sykmelding.meldingTilArbeidsgiver}
                parentId={sectionId}
            />
            {sykmelding.kontaktMedPasient && (
                <Tilbakedatering kontaktMedPasient={sykmelding.kontaktMedPasient} parentId={sectionId} />
            )}
        </div>
    )
}

export default SykmeldingArbeidsgiver
