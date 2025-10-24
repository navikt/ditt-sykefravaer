import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import {
    AktivitetIkkeMuligPeriode,
    ArbeidsrelatertArsakType,
    MedisinskArsakType,
} from '../../../../types/sykmelding/sykmelding'

import AktivitetIkkeMulig from './AktivitetIkkeMulig'

describe('AktivitetIkkeMulig', () => {
    it('Render arbeidsrelatert arsak for arbeidsgiver view', () => {
        const periode: AktivitetIkkeMuligPeriode = {
            medisinskArsak: {
                beskrivelse: 'medisinsk beskrivelse',
                arsak: [MedisinskArsakType.TILSTAND_HINDRER_AKTIVITET],
            },
            arbeidsrelatertArsak: {
                beskrivelse: 'arbeidsrelatert beskrivelse',
                arsak: [ArbeidsrelatertArsakType.MANGLENDE_TILRETTELEGGING],
            },
        }

        render(<AktivitetIkkeMulig aktivitetIkkeMulig={periode} parentId="test" />)

        expect(
            screen.getByText('Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet'),
        ).toBeInTheDocument()
        expect(screen.getByText('Manglende tilrettelegging på arbeidsplassen')).toBeInTheDocument()
        expect(screen.getByText('arbeidsrelatert beskrivelse')).toBeInTheDocument()
    })
})
