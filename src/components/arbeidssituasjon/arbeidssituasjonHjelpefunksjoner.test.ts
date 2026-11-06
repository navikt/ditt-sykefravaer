import { describe, expect, it } from 'vitest'

import { DittSykefravaerSykmelding } from '../../types/dittSykefravaerSykmelding'
import { RegelStatus, StatusEvent } from '../../types/sykmelding/sykmelding'

import { finnAktuelleArbeidsgivere } from './arbeidssituasjonHjelpefunksjoner'

describe('finnAktuelleArbeidsgivere', () => {
    it('tar med arbeidsgiver med aktiv leder uten navn selv om sykmeldingen er eldre enn tre måneder', () => {
        const sykmelding: DittSykefravaerSykmelding = {
            id: 'sykmelding',
            sykmeldingStatus: {
                statusEvent: StatusEvent.SENDT,
                arbeidsgiver: { orgnummer: '123', orgNavn: 'Arbeidsgiver' },
            },
            behandlingsutfall: { status: RegelStatus.OK, erUnderBehandling: false },
            sykmeldingsperioder: [{ fom: '2020-01-01', tom: '2020-01-31' }],
        }
        const leder = { id: 'leder', navn: '', orgnummer: '123', aktivFom: '2020-01-01' }
        expect(finnAktuelleArbeidsgivere([leder], [sykmelding])).toEqual(['123'])
        expect(finnAktuelleArbeidsgivere([], [sykmelding])).toEqual([])
    })
})
