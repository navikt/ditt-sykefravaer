import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Prognose } from '../../../../types/sykmelding/sykmelding'

import PrognoseView from './PrognoseView'

describe('PrognoseView', () => {
    it('Viser seksjonstittelen', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseView prognose={prognose} parentId="test" />)
        expect(screen.getByText('Prognose')).toBeInTheDocument()
    })

    it('Viser arbeidsforEtterPeriode hvis true', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseView prognose={prognose} parentId="test" />)
        expect(screen.getByText('Er pasienten 100% arbeidsfør etter denne perioden?')).toBeInTheDocument()
    })

    it('Viser ikke arbeidsforEtterPeriode hvis false', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: false,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseView prognose={prognose} parentId="test" />)
        expect(screen.queryByText('Er pasienten 100% arbeidsfør etter denne perioden?')).not.toBeInTheDocument()
    })

    it('Viser hensynArbeidsplassen', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseView prognose={prognose} parentId="test" />)
        expect(screen.getByText('Hensyn som må tas på arbeidsplassen')).toBeInTheDocument()
        expect(screen.getByText('hensyn på arbeidsplassen')).toBeInTheDocument()
    })

    it('Viser ikke hensynArbeidsplassen hvis null', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: null,
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseView prognose={prognose} parentId="test" />)
        expect(screen.queryByText('Hensyn som må tas på arbeidsplassen')).not.toBeInTheDocument()
    })
})
