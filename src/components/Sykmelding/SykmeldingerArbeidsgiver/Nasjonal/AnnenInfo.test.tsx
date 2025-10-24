import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Periodetype, RegelStatus, StatusEvent, Sykmelding } from '../../../../types/sykmelding/sykmelding'

import AnnenInfo from './AnnenInfo'

describe('AnnenInfo', () => {
    it('Renders behandler phone if it exist', () => {
        const sykmelding: Sykmelding = {
            id: '123',
            mottattTidspunkt: '2020-01-10',
            behandlingsutfall: {
                status: RegelStatus.OK,
                ruleHits: [],
            },
            arbeidsgiver: null,
            sykmeldingsperioder: [
                {
                    fom: '2020-02-10',
                    tom: '2020-02-15',
                    behandlingsdager: 2,
                    type: Periodetype.BEHANDLINGSDAGER,
                    reisetilskudd: false,
                    gradert: null,
                    innspillTilArbeidsgiver: null,
                    aktivitetIkkeMulig: null,
                },
            ],
            sykmeldingStatus: {
                timestamp: '2020-01-01',
                statusEvent: StatusEvent.APEN,
                arbeidsgiver: null,
            },
            medisinskVurdering: null,
            prognose: null,
            utdypendeOpplysninger: {},
            tiltakArbeidsplassen: null,
            tiltakNAV: null,
            andreTiltak: null,
            meldingTilNAV: null,
            meldingTilArbeidsgiver: null,
            kontaktMedPasient: {
                kontaktDato: '2020-04-01',
                begrunnelseIkkeKontakt: 'Han var kjempesyk',
            },
            behandletTidspunkt: '2020-01-01',
            behandler: {
                fornavn: 'Frida',
                mellomnavn: 'Perma',
                etternavn: 'Frost',
                adresse: {
                    gate: null,
                    postnummer: null,
                    kommune: null,
                    postboks: null,
                    land: null,
                },
                tlf: '12345678',
            },
            egenmeldt: null,
            papirsykmelding: null,
            merknader: null,
            pasient: {
                fnr: '123456789',
                fornavn: null,
                mellomnavn: null,
                etternavn: null,
                overSyttiAar: null,
            },
            rulesetVersion: 2,
        }

        render(<AnnenInfo sykmelding={sykmelding} parentId="test" />)
        expect(screen.getByText('Tlf: 12345678')).toBeInTheDocument()
    })

    it('Render hyphen if behandler phone does noe exist', () => {
        const sykmelding: Sykmelding = {
            id: '123',
            mottattTidspunkt: '2020-01-10',
            behandlingsutfall: {
                status: RegelStatus.OK,
                ruleHits: [],
            },
            arbeidsgiver: null,
            sykmeldingsperioder: [
                {
                    fom: '2020-02-10',
                    tom: '2020-02-15',
                    behandlingsdager: 2,
                    type: Periodetype.BEHANDLINGSDAGER,
                    reisetilskudd: false,
                    gradert: null,
                    innspillTilArbeidsgiver: null,
                    aktivitetIkkeMulig: null,
                },
            ],
            sykmeldingStatus: {
                timestamp: '2020-01-01',
                statusEvent: StatusEvent.APEN,
                arbeidsgiver: null,
            },
            medisinskVurdering: null,
            prognose: null,
            utdypendeOpplysninger: {},
            tiltakArbeidsplassen: null,
            tiltakNAV: null,
            andreTiltak: null,
            meldingTilNAV: null,
            meldingTilArbeidsgiver: null,
            kontaktMedPasient: {
                kontaktDato: '2020-04-01',
                begrunnelseIkkeKontakt: 'Han var kjempesyk',
            },
            behandletTidspunkt: '2020-01-01',
            behandler: {
                fornavn: 'Frida',
                mellomnavn: 'Perma',
                etternavn: 'Frost',
                adresse: {
                    gate: null,
                    postnummer: null,
                    kommune: null,
                    postboks: null,
                    land: null,
                },
                tlf: null,
            },
            egenmeldt: null,
            papirsykmelding: null,
            merknader: null,
            pasient: {
                fnr: '123456789',
                fornavn: null,
                mellomnavn: null,
                etternavn: null,
                overSyttiAar: null,
            },
            rulesetVersion: 2,
        }

        render(<AnnenInfo sykmelding={sykmelding} parentId="test" />)
        expect(screen.getByText('Tlf: mangler')).toBeInTheDocument()
    })
})
