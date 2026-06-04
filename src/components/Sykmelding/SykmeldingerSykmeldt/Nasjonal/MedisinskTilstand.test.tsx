import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { AnnenFraverGrunn, MedisinskVurdering } from '../../../../types/sykmelding/sykmelding'

import MedisinskTilstand from './MedisinskTilstand'

describe('MedisinskTilstand', () => {
    it('Viser annenFraversArsak hvis den finnes', () => {
        const medisinskVurdering: MedisinskVurdering = {
            hovedDiagnose: null,
            biDiagnoser: [],
            annenFraversArsak: {
                beskrivelse: 'Dette er en beskrivelse',
                grunn: [AnnenFraverGrunn.DONOR],
            },
            svangerskap: false,
            yrkesskade: false,
            yrkesskadeDato: null,
        }
        render(<MedisinskTilstand medisinskVurdering={medisinskVurdering} isV3={false} parentId="test" />)

        expect(screen.getByText('Annen lovfestet fraværsgrunn')).toBeInTheDocument()
        expect(screen.getByText('Når vedkommende er donor eller er under vurdering som donor')).toBeInTheDocument()

        expect(screen.getByText('Beskrivelse av fraværsgrunn')).toBeInTheDocument()
        expect(screen.getByText('Dette er en beskrivelse')).toBeInTheDocument()
    })

    it('Viser svangerskapsrelatert hvis den finnes', () => {
        const medisinskVurdering: MedisinskVurdering = {
            hovedDiagnose: null,
            biDiagnoser: [],
            svangerskap: true,
            yrkesskade: false,
            yrkesskadeDato: null,
            annenFraversArsak: null,
        }
        render(<MedisinskTilstand medisinskVurdering={medisinskVurdering} isV3={false} parentId="test" />)

        expect(screen.getByText('Er sykdommen svangerskapsrelatert?')).toBeInTheDocument()
    })

    it('Viser yrkesskade hvis den finnes', () => {
        const medisinskVurdering: MedisinskVurdering = {
            hovedDiagnose: null,
            biDiagnoser: [],
            svangerskap: false,
            yrkesskade: true,
            yrkesskadeDato: '2020-04-01',
            annenFraversArsak: null,
        }
        render(<MedisinskTilstand medisinskVurdering={medisinskVurdering} isV3={false} parentId="test" />)

        expect(screen.getByText('Kan sykdommen skyldes en yrkesskade/yrkessykdom?')).toBeInTheDocument()

        expect(screen.getByText('Skadedato')).toBeInTheDocument()
        expect(screen.getByText('1. april 2020')).toBeInTheDocument()
    })

    it('skal rendre Bidiagnose', () => {
        const medisinskVurdering: MedisinskVurdering = {
            annenFraversArsak: {
                beskrivelse: '',
                grunn: [],
            },
            biDiagnoser: [
                {
                    kode: '',
                    system: '',
                    tekst: 'Vondt i foten',
                },
            ],
            hovedDiagnose: null,
            svangerskap: false,
            yrkesskade: false,
            yrkesskadeDato: null,
        }
        render(<MedisinskTilstand medisinskVurdering={medisinskVurdering} isV3={false} parentId="test" />)
        expect(screen.getByText('Bidiagnose')).toBeInTheDocument()
        expect(screen.getByText('Vondt i foten')).toBeInTheDocument()
    })

    it('skal ikke rendre Bidiagnose hvis tekst mangler', () => {
        const medisinskVurdering: MedisinskVurdering = {
            annenFraversArsak: {
                beskrivelse: '',
                grunn: [],
            },
            biDiagnoser: [],
            hovedDiagnose: null,
            svangerskap: false,
            yrkesskade: false,
            yrkesskadeDato: null,
        }
        render(<MedisinskTilstand medisinskVurdering={medisinskVurdering} isV3={false} parentId="test" />)
        expect(screen.queryByText('Bidiagnose')).not.toBeInTheDocument()
    })
})
