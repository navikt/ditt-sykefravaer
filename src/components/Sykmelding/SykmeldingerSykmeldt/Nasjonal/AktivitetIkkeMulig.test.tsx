import { describe, it, expect } from 'vitest'

import {
    AktivitetIkkeMuligPeriode,
    ArbeidsrelatertArsakType,
    MedisinskArsakType,
} from '../../../../types/sykmelding/sykmelding'
import { render, screen } from '../../../../utils/test/testUtils'

import AktivitetIkkeMulig from './AktivitetIkkeMulig'

describe('AktivitetIkkeMulig', () => {
    it('Renders aktivitet ikke mulig periode with specified medisinsk- and arbeidsrelatert arsak', async () => {
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

        render(<AktivitetIkkeMulig aktivitetIkkeMulig={periode} isV3={false} parentId="test" />)

        expect(screen.getByText('Medisinske årsaker hindrer arbeidsrelatert aktivitet')).toBeInTheDocument()
        expect(screen.getByText('Helsetilstanden hindrer pasienten i å være i aktivitet')).toBeInTheDocument()
        expect(screen.getByText('medisinsk beskrivelse')).toBeInTheDocument()

        expect(
            screen.getByText('Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet'),
        ).toBeInTheDocument()
        expect(screen.getByText('Manglende tilrettelegging på arbeidsplassen')).toBeInTheDocument()
        expect(screen.getByText('arbeidsrelatert beskrivelse')).toBeInTheDocument()
    })

    it('should display text if medisinskArsak and arbeidsrelatertArsak is missing', () => {
        const periode: AktivitetIkkeMuligPeriode = {
            medisinskArsak: null,
            arbeidsrelatertArsak: null,
        }

        render(<AktivitetIkkeMulig aktivitetIkkeMulig={periode} isV3={false} parentId="test" />)
        expect(screen.getByText('Aktivitet på arbeidsplassen')).toBeInTheDocument()
        expect(
            screen.getByText('Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet'),
        ).toBeInTheDocument()
        expect(screen.getByText('Ikke utfylt av behandler')).toBeInTheDocument()
    })
})
