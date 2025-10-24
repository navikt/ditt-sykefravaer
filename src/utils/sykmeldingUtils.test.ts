import { describe, expect, it } from 'vitest'

import { Merknadtype, RegelStatus, StatusEvent, Sykmelding } from '../types/sykmelding/sykmelding'
import { testDato } from '../data/mock/mock-db/data-creators'

import {
    getReadableSykmeldingLength,
    getSykmeldingEndDate,
    getSykmeldingStartDate,
    getSykmeldingTitle,
    isActiveSykmelding,
    extractSykmeldingIdFromUrl,
    isValidSykmeldingId,
    validateSykmeldingId,
    isPostSykmeldingSend,
} from './sykmeldingUtils'
import { dateSub } from './dateUtils'
import { createSykmeldingPeriode } from './test/dataUtils'

const minimalSykmelding: Sykmelding = {
    id: 'APEN_PAPIR',
    mottattTidspunkt: dateSub(testDato, { days: 1 }),
    behandlingsutfall: {
        status: RegelStatus.OK,
        ruleHits: [],
    },
    arbeidsgiver: null,
    sykmeldingsperioder: [],
    sykmeldingStatus: {
        timestamp: '2020-01-01',
        statusEvent: StatusEvent.APEN,
        arbeidsgiver: null,
    },
    medisinskVurdering: null,
    utdypendeOpplysninger: {},
    kontaktMedPasient: { kontaktDato: null, begrunnelseIkkeKontakt: null },
    behandletTidspunkt: '2020-01-01',
    behandler: {
        fornavn: 'Fornavn',
        mellomnavn: null,
        etternavn: 'Etternavn',
        adresse: {
            gate: null,
            postnummer: null,
            kommune: null,
            postboks: null,
            land: null,
        },
        tlf: '900 00 000',
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
    andreTiltak: null,
    meldingTilArbeidsgiver: null,
    meldingTilNAV: null,
    prognose: null,
    tiltakArbeidsplassen: null,
    tiltakNAV: null,
    utenlandskSykmelding: null,
    rulesetVersion: 2,
}

describe('isActiveSykmelding', () => {
    it('should be inactive if status is not APEN', () => {
        expect(
            isActiveSykmelding({
                ...minimalSykmelding,
                sykmeldingStatus: {
                    ...minimalSykmelding.sykmeldingStatus,
                    statusEvent: StatusEvent.AVBRUTT,
                },
            }),
        ).toBe(false)
    })

    it('should be inactive if status is SENDT', () => {
        expect(
            isActiveSykmelding({
                ...minimalSykmelding,
                sykmeldingStatus: {
                    ...minimalSykmelding.sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
            }),
        ).toBe(false)
    })

    it('should be NOT be active if status is SENDT with merknad UNDER_BEHANDLING', () => {
        expect(
            isActiveSykmelding({
                ...minimalSykmelding,
                sykmeldingStatus: {
                    ...minimalSykmelding.sykmeldingStatus,
                    statusEvent: StatusEvent.SENDT,
                },
                merknader: [{ type: Merknadtype.UNDER_BEHANDLING, beskrivelse: null }],
            }),
        ).toBe(false)
    })

    it('should be active if status is APEN', () => {
        expect(
            isActiveSykmelding({
                ...minimalSykmelding,
                sykmeldingStatus: {
                    ...minimalSykmelding.sykmeldingStatus,
                    statusEvent: StatusEvent.APEN,
                },
            }),
        ).toBe(true)
    })

    it('burde være inaktiv dersom status er APEN, men er eldre enn ett år', () => {
        expect(
            isActiveSykmelding(
                {
                    ...minimalSykmelding,
                    mottattTidspunkt: dateSub(testDato, { days: 365 }),
                    sykmeldingStatus: {
                        ...minimalSykmelding.sykmeldingStatus,
                        statusEvent: StatusEvent.APEN,
                    },
                },
                testDato,
            ),
        ).toBe(false)
    })
})

describe('getSykmeldingTitle', () => {
    it('Gets standard sykmelding title', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
        }
        expect(getSykmeldingTitle(sykmelding)).toEqual('Sykmelding')
    })

    it('Gets papirsykmelding title', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            papirsykmelding: true,
        }
        expect(getSykmeldingTitle(sykmelding)).toEqual('Papirsykmelding')
    })

    it('Gets egenmeldt title', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            egenmeldt: true,
        }
        expect(getSykmeldingTitle(sykmelding)).toEqual('Egenmelding')
    })

    it('Gets utenlandsk title', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            utenlandskSykmelding: {
                land: 'Sverige',
            },
        }
        expect(getSykmeldingTitle(sykmelding)).toEqual('Utenlandsk sykmelding')
    })
})

describe('getSykmeldingStartDate', () => {
    it('Gets fom of the earliest period', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            sykmeldingsperioder: [
                createSykmeldingPeriode({ fom: '2021-05-01', tom: '2021-05-03' }),
                createSykmeldingPeriode({ fom: '2021-04-01', tom: '2021-04-03' }),
                createSykmeldingPeriode({ fom: '2021-06-01', tom: '2021-06-03' }),
            ],
        }
        expect(getSykmeldingStartDate(sykmelding.sykmeldingsperioder)).toEqual('2021-04-01')
    })
})

describe('getSykmeldingEndDate', () => {
    it('Gets tom of the latest period', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            sykmeldingsperioder: [
                createSykmeldingPeriode({ fom: '2021-06-01', tom: '2021-06-03' }),
                createSykmeldingPeriode({ fom: '2021-05-01', tom: '2021-05-03' }),
                createSykmeldingPeriode({ fom: '2021-04-01', tom: '2021-04-03' }),
            ],
        }
        expect(getSykmeldingEndDate(sykmelding.sykmeldingsperioder)).toEqual('2021-06-03')
    })
})

describe('getReadableSykmeldingLength', () => {
    it('Lenght is one day', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            sykmeldingsperioder: [createSykmeldingPeriode({ fom: '2021-06-01', tom: '2021-06-01' })],
        }
        expect(getReadableSykmeldingLength(sykmelding)).toBe('1. juni 2021')
    })

    it('Within same year', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            sykmeldingsperioder: [
                createSykmeldingPeriode({ fom: '2021-06-01', tom: '2021-06-03' }),
                createSykmeldingPeriode({ fom: '2021-05-01', tom: '2021-05-03' }),
                createSykmeldingPeriode({ fom: '2021-04-01', tom: '2021-04-03' }),
            ],
        }
        expect(getReadableSykmeldingLength(sykmelding)).toBe('1. april - 3. juni 2021')
    })

    it('Within same year and month', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            sykmeldingsperioder: [
                createSykmeldingPeriode({ fom: '2021-06-20', tom: '2021-06-24' }),
                createSykmeldingPeriode({ fom: '2021-06-01', tom: '2021-06-03' }),
                createSykmeldingPeriode({ fom: '2021-06-06', tom: '2021-06-09' }),
            ],
        }
        expect(getReadableSykmeldingLength(sykmelding)).toBe('1. - 24. juni 2021')
    })

    it('Different years', () => {
        const sykmelding: Sykmelding = {
            ...minimalSykmelding,
            sykmeldingsperioder: [
                createSykmeldingPeriode({ fom: '2020-12-25', tom: '2020-12-31' }),
                createSykmeldingPeriode({ fom: '2021-01-01', tom: '2021-01-06' }),
            ],
        }
        expect(getReadableSykmeldingLength(sykmelding)).toBe('25. desember 2020 - 6. januar 2021')
    })
})

describe('extractSykmeldingIdFromUrl', () => {
    it('extracts id from valid url', () => {
        expect(
            extractSykmeldingIdFromUrl(
                '/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/123e4567-e89b-12d3-a456-426614174000/send',
            ),
        ).toBe('123e4567-e89b-12d3-a456-426614174000')
    })
    it('returns null for invalid url', () => {
        expect(extractSykmeldingIdFromUrl('/api/other/123e4567-e89b-12d3-a456-426614174000/send')).toBeNull()
        expect(extractSykmeldingIdFromUrl('/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/invalid')).toBeNull()
    })
})

describe('isValidSykmeldingId', () => {
    /*
        Tidlig i utviklingen av sykmeldinger i 2016 ble det brukt flere forskjellige ID-formater.
        Denne testen viser hva slags formater de hadde og tester identifikasjon av dem.
     */
    it('returns true for valid UUID', () => {
        expect(isValidSykmeldingId('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
    })
    it('returns true for valid legacyFormat1', () => {
        expect(isValidSykmeldingId('1611032236vert68525.1')).toBe(true)
    })
    it('returns true for valid legacyFormat2', () => {
        expect(isValidSykmeldingId('16092333673beg74487.1')).toBe(true)
    })
    it('returns true for valid legacyFormat3', () => {
        expect(isValidSykmeldingId('ID:616d51316d516c53633133313131313185683857e96df313')).toBe(true)
    })
    it('returns false for invalid id', () => {
        expect(isValidSykmeldingId('not/valid')).toBe(false)
    })
})

describe('validateSykmeldingId', () => {
    it('returns the id when valid', () => {
        expect(validateSykmeldingId('1')).toBe('1')
    })
    it('throws when id invalid', () => {
        expect(() => validateSykmeldingId('not/valid')).toThrowError()
    })
    it('returns trimmed id', () => {
        expect(validateSykmeldingId('1 ')).toBe('1')
    })
})

describe('isPostSykmeldingSend', () => {
    it('returns true for valid url and valid UUID format', () => {
        expect(
            isPostSykmeldingSend(
                '/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/123e4567-e89b-12d3-a456-426614174000/send',
            ),
        ).toBe(true)
    })
    it('returns true for valid url and valid id (legacyFormat1)', () => {
        expect(
            isPostSykmeldingSend('/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/1611032236vert68525.1/send'),
        ).toBe(true)
    })
    it('returns true for valid url and valid id (legacyFormat2)', () => {
        expect(
            isPostSykmeldingSend('/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/16092333673beg74487.1/send'),
        ).toBe(true)
    })
    it('returns true for valid url and valid id (legacyFormat3)', () => {
        expect(
            isPostSykmeldingSend(
                '/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/ID:616d51316d516c53633133313131313185683857e96df313/send',
            ),
        ).toBe(true)
    })
    it('returns false for valid url but invalid id', () => {
        expect(isPostSykmeldingSend('/api/flex-sykmeldinger-backend/api/v1/sykmeldinger/not&valid/send')).toBe(false)
    })
    it('returns false for invalid url', () => {
        expect(isPostSykmeldingSend('/api/other/123e4567-e89b-12d3-a456-426614174000/send')).toBe(false)
    })
})
