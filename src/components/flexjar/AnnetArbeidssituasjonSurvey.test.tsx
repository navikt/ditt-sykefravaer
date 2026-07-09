import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

import { render, screen } from '../../utils/test/testUtils'

class MockResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)

import { AnnetArbeidssituasjonSurvey } from './AnnetArbeidssituasjonSurvey'

const opprettFeedbackMutate = vi.fn()
const oppdaterFeedbackMutate = vi.fn()

vi.mock('./queryhooks/useOpprettFlexjarFeedback', () => ({
    UseOpprettFlexjarFeedback: () => ({
        mutate: opprettFeedbackMutate,
        data: undefined,
    }),
}))

vi.mock('./queryhooks/useOppdaterFlexjarFeedback', () => ({
    UseOppdaterFlexjarFeedback: () => ({
        mutate: oppdaterFeedbackMutate,
    }),
}))

describe('AnnetArbeidssituasjonSurvey', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('viser survey-skjema med alle felter', () => {
        render(<AnnetArbeidssituasjonSurvey />)

        expect(screen.getByText('Hjelp oss å forbedre valgene for arbeidssituasjon')).toBeInTheDocument()
        expect(screen.getByText('Svarene dine er anonyme')).toBeInTheDocument()
        expect(
            screen.getByText('Dette er ikke en del av sykmeldingen din. Svarene går ikke til saksbehandleren din.'),
        ).toBeInTheDocument()
        expect(screen.getByText('Hva er grunnen til at du valgte arbeidssituasjon annet?')).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Jeg er pensjonist' })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Jeg fikk ikke opp riktig arbeidsgiver' })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Jeg jobber i eget AS' })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Jeg mottar AAP' })).toBeInTheDocument()
        expect(
            screen.getByRole('radio', { name: 'Jeg mottar uføretrygd (uten varig tilrettelagt arbeid)' }),
        ).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Jeg har varig tilrettelagt arbeid (VTA)' })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: 'Annen årsak' })).toBeInTheDocument()
        expect(screen.queryByLabelText(/Skriv hvilken arbeidssituasjon som gjelder deg/i)).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Send tilbakemelding' })).toBeInTheDocument()
    })

    it('initierer feedback ved mount', () => {
        render(<AnnetArbeidssituasjonSurvey />)

        expect(opprettFeedbackMutate).toHaveBeenCalledWith({
            feedback: '',
            feedbackId: 'arbeidssituasjon-annet',
            svar: '',
        })
    })

    it('viser valideringsfeil ved send uten valgt årsak', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(screen.getByText('Du må velge en årsak.')).toBeInTheDocument()
    })

    it('sender feedback med valgt årsak og fritekst', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('radio', { name: 'Annen årsak' }))
        await userEvent.type(screen.getByLabelText(/Skriv hvilken arbeidssituasjon/i), 'Pensjonist med deltidsjobb')
        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(opprettFeedbackMutate).toHaveBeenLastCalledWith(
            expect.objectContaining({
                feedbackId: 'arbeidssituasjon-annet',
                svar: 'Annen årsak',
                feedback: 'Pensjonist med deltidsjobb',
            }),
        )
    })

    it('fjerner valideringsfeil når bruker velger årsak', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))
        expect(screen.getByText('Du må velge en årsak.')).toBeInTheDocument()

        await userEvent.click(screen.getByRole('radio', { name: 'Annen årsak' }))
        expect(screen.queryByText('Du må velge en årsak.')).not.toBeInTheDocument()
    })

    it('viser fritekstfelt kun når Annen årsak er valgt', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        expect(screen.queryByLabelText(/Skriv hvilken arbeidssituasjon/i)).not.toBeInTheDocument()

        await userEvent.click(screen.getByRole('radio', { name: 'Jeg er pensjonist' }))
        expect(screen.queryByLabelText(/Skriv hvilken arbeidssituasjon/i)).not.toBeInTheDocument()

        await userEvent.click(screen.getByRole('radio', { name: 'Annen årsak' }))
        expect(screen.getByLabelText(/Skriv hvilken arbeidssituasjon/i)).toBeInTheDocument()

        await userEvent.click(screen.getByRole('radio', { name: 'Jeg er pensjonist' }))
        expect(screen.queryByLabelText(/Skriv hvilken arbeidssituasjon/i)).not.toBeInTheDocument()
    })
})
