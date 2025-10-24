import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { MedisinskVurdering } from '../../../../types/sykmelding/sykmelding'

import Diagnoser from './Diagnoser'

describe('Diagnoser', () => {
    it('should render title', () => {
        const medisinskVurdering: MedisinskVurdering = {
            annenFraversArsak: {
                beskrivelse: '',
                grunn: [],
            },
            biDiagnoser: [
                {
                    kode: '',
                    system: '',
                    tekst: '',
                },
            ],
            hovedDiagnose: {
                kode: '',
                system: '',
                tekst: '',
            },
            svangerskap: false,
            yrkesskade: false,
            yrkesskadeDato: '',
        }
        render(<Diagnoser medisinskVurdering={medisinskVurdering} parentId="test" />)
        expect(screen.getByText('Medisinsk tilstand')).toBeInTheDocument()
    })

    it('should not render Bidiagnose if tekst is missing', () => {
        const medisinskVurdering: MedisinskVurdering = {
            annenFraversArsak: {
                beskrivelse: '',
                grunn: [],
            },
            biDiagnoser: [],
            hovedDiagnose: null,
            svangerskap: false,
            yrkesskade: false,
            yrkesskadeDato: '',
        }
        render(<Diagnoser medisinskVurdering={medisinskVurdering} parentId="test" />)
        expect(screen.queryByText('Bidiagnose')).not.toBeInTheDocument()
    })
})
