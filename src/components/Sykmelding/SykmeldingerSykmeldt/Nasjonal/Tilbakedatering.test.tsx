import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { KontaktMedPasient } from '../../../../types/sykmelding/sykmelding'

import Tilbakedatering from './Tilbakedatering'

describe('Tilbakedatering', () => {
    it('Viser kontaktdato', () => {
        const kontaktMedPasient: KontaktMedPasient = {
            kontaktDato: '2021-04-01',
            begrunnelseIkkeKontakt: null,
        }
        render(<Tilbakedatering kontaktMedPasient={kontaktMedPasient} parentId="test" />)

        expect(screen.getByText('Tilbakedatering')).toBeInTheDocument()
        expect(screen.getByText('Dato for dokumenterbar kontakt med pasienten')).toBeInTheDocument()
        expect(screen.getByText('1. april 2021')).toBeInTheDocument()
    })

    it('Viser begrunnelse', () => {
        const kontaktMedPasient: KontaktMedPasient = {
            kontaktDato: '2021-04-01',
            begrunnelseIkkeKontakt: 'han var kjempesyk',
        }
        render(<Tilbakedatering kontaktMedPasient={kontaktMedPasient} parentId="test" />)

        expect(screen.getByText('Begrunnelse for tilbakedatering')).toBeInTheDocument()
        expect(screen.getByText('han var kjempesyk')).toBeInTheDocument()
    })

    it('skal ikke rendre tittel hvis kontaktDato og begrunnelseIkkeKontakt', () => {
        const kontaktMedPasient: KontaktMedPasient = {
            kontaktDato: null,
            begrunnelseIkkeKontakt: null,
        }
        render(<Tilbakedatering kontaktMedPasient={kontaktMedPasient} parentId="test" />)

        expect(screen.queryByText('Begrunnelse for tilbakedatering')).not.toBeInTheDocument()
    })
})
