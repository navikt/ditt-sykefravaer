import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Merknad, Merknadtype } from '../../types/sykmelding/sykmelding'

import InformationBanner from './InformationBanner'

describe('InformationBanner', () => {
    it('Viser visning for merknad UGYLDIG_TILBAKEDATERING', async () => {
        const merknad: Merknad = {
            type: Merknadtype.UGYLDIG_TILBAKEDATERING,
            beskrivelse: null,
        }

        render(<InformationBanner merknader={[merknad]} />)
        expect(screen.getByTestId('merknad-banner')).toBeInTheDocument()
        expect(screen.queryByTestId('papir-banner')).not.toBeInTheDocument()
        expect(screen.getByText('Tilbakedateringen kan ikke godkjennes')).toBeInTheDocument()
    })

    it('Viser visning for merknad TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER', () => {
        const merknad: Merknad = {
            type: Merknadtype.TILBAKEDATERING_KREVER_FLERE_OPPLYSNINGER,
            beskrivelse: null,
        }

        render(<InformationBanner merknader={[merknad]} />)
        expect(screen.getByTestId('merknad-banner')).toBeInTheDocument()
        expect(screen.queryByTestId('papir-banner')).not.toBeInTheDocument()
        expect(screen.getByText('Behov for mer opplysninger')).toBeInTheDocument()
    })

    it('Viser visning for merknad TILBAKEDATERING_UNDER_BEHANDLING', () => {
        const merknad: Merknad = {
            type: Merknadtype.UNDER_BEHANDLING,
            beskrivelse: null,
        }

        render(<InformationBanner merknader={[merknad]} />)
        expect(screen.getByTestId('merknad-banner')).toBeInTheDocument()
        expect(screen.queryByTestId('papir-banner')).not.toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Viktig informasjon' })).toBeInTheDocument()
    })

    it('Viser papirsinfo-visning hvis papirsykmelding er true', () => {
        render(<InformationBanner papirsykmelding />)
        expect(screen.queryByTestId('merknad-banner')).not.toBeInTheDocument()
        expect(screen.getByTestId('papir-banner')).toBeInTheDocument()
        expect(screen.getByText('Før du bruker sykmeldingen')).toBeInTheDocument()
    })

    it('Viser over 70-visning hvis over 70 er true', () => {
        render(<InformationBanner overSyttiAar />)

        expect(
            screen.getByText('Når du har passert 70 år, har du ikke lenger rett til sykepenger.'),
        ).toBeInTheDocument()
    })

    it('Viser normal visning hvis merknader og papirsykmelding er undefined', () => {
        render(<InformationBanner merknader={null} papirsykmelding={null} />)
        expect(screen.queryByTestId('merknad-banner')).not.toBeInTheDocument()
        expect(screen.queryByTestId('papir-banner')).not.toBeInTheDocument()
        expect(screen.getByText('Vi har mottatt sykmeldingen din')).toBeInTheDocument()
        expect(
            screen.getByText(
                'Under ser du opplysningene vi har fått fra behandleren din. Stemmer dette med det dere ble enige om?',
            ),
        ).toBeInTheDocument()
        expect(screen.getByText('Når du er ferdig sender du sykmeldingen, nederst på siden.')).toBeInTheDocument()
    })

    it('Viser info om sykmelding under 20% hvis sykmelding er under 20%', () => {
        render(<InformationBanner isUnder20Percent={19} />)

        expect(screen.queryByTestId('merknad-banner')).not.toBeInTheDocument()
        expect(screen.queryByTestId('papir-banner')).not.toBeInTheDocument()
        expect(screen.getByText(/Denne sykmeldingen viser at du er 19 prosent sykmeldt/i)).toBeInTheDocument()
    })
})
