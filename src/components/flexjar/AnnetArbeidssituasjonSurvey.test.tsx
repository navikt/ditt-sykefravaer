import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

import { render, screen } from '../../utils/test/testUtils'

import { AnnetArbeidssituasjonSurvey } from './AnnetArbeidssituasjonSurvey'

class MockResizeObserver {
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
}
vi.stubGlobal('ResizeObserver', MockResizeObserver)

const opprettFeedbackMutate = vi.fn()
const oppdaterFeedbackMutate = vi.fn()

let mockFeedbackData: { id: string } | undefined = undefined

vi.mock('./queryhooks/useOpprettFlexjarFeedback', () => ({
    UseOpprettFlexjarFeedback: () => ({
        mutate: opprettFeedbackMutate,
        get data() {
            return mockFeedbackData
        },
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
        mockFeedbackData = undefined
    })

    it('viser survey-skjema med alle felter', () => {
        render(<AnnetArbeidssituasjonSurvey />)

        expect(screen.getByText('Hjelp oss å forbedre valgene for arbeidssituasjon')).toBeInTheDocument()
        expect(screen.getByText('Svarene dine er anonyme')).toBeInTheDocument()
        expect(
            screen.getByText('Dette er ikke en del av sykmeldingen din. Svarene går ikke til saksbehandleren din.'),
        ).toBeInTheDocument()
        expect(screen.getByText('Hva er grunnen til at du valgte arbeidssituasjon "annet"?')).toBeInTheDocument()
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

    it('sender ikke feedback ved mount uten valgt årsak', () => {
        render(<AnnetArbeidssituasjonSurvey />)

        expect(opprettFeedbackMutate).not.toHaveBeenCalled()
    })

    it('viser valideringsfeil ved send uten valgt årsak', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(screen.getByText('Du må velge en årsak.')).toBeInTheDocument()
    })

    it('viser valideringsfeil på fritekst ved send med "Annen årsak" uten tekst', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('radio', { name: 'Annen årsak' }))
        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(screen.getByText('Du må beskrive arbeidssituasjonen din.')).toBeInTheDocument()
        expect(opprettFeedbackMutate).not.toHaveBeenCalledWith(expect.objectContaining({ svar: 'ANNEN_ARSAK' }))
    })

    it('fjerner fritekstvalideringsfeil når bruker skriver i fritekstfeltet', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('radio', { name: 'Annen årsak' }))
        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))
        expect(screen.getByText('Du må beskrive arbeidssituasjonen din.')).toBeInTheDocument()

        await userEvent.type(screen.getByLabelText(/Skriv hvilken arbeidssituasjon/i), 'Noe')
        expect(screen.queryByText('Du må beskrive arbeidssituasjonen din.')).not.toBeInTheDocument()
    })


        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('radio', { name: 'Annen årsak' }))
        await userEvent.type(screen.getByLabelText(/Skriv hvilken arbeidssituasjon/i), 'Pensjonist med deltidsjobb')
        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(opprettFeedbackMutate).toHaveBeenLastCalledWith(
            expect.objectContaining({
                feedbackId: 'arbeidssituasjon-annet',
                svar: 'ANNEN_ARSAK',
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

    it('sender feedback når bruker gjør første valg', async () => {
        render(<AnnetArbeidssituasjonSurvey />)

        expect(opprettFeedbackMutate).not.toHaveBeenCalled()

        await userEvent.click(screen.getByRole('radio', { name: 'Jeg er pensjonist' }))

        expect(opprettFeedbackMutate).toHaveBeenCalledWith({
            feedback: '',
            feedbackId: 'arbeidssituasjon-annet',
            svar: 'PENSJONIST',
        })
    })

    it('oppdaterer eksisterende post (ikke oppretter på nytt) når data.id er satt', async () => {
        mockFeedbackData = { id: 'test-id' }
        render(<AnnetArbeidssituasjonSurvey />)

        await userEvent.click(screen.getByRole('radio', { name: 'Jeg er pensjonist' }))
        await userEvent.click(screen.getByRole('radio', { name: 'Jeg mottar AAP' }))

        expect(opprettFeedbackMutate).not.toHaveBeenCalled()
        expect(oppdaterFeedbackMutate).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'test-id',
                body: expect.objectContaining({ svar: 'AAP' }),
            }),
        )
    })

    it('kaller onTakk når feedback er sendt', async () => {
        mockFeedbackData = { id: 'test-id' }
        oppdaterFeedbackMutate.mockImplementation(({ cb }: { cb?: () => void }) => cb?.())
        const onTakk = vi.fn()
        render(<AnnetArbeidssituasjonSurvey onTakk={onTakk} />)

        await userEvent.click(screen.getByRole('radio', { name: 'Jeg er pensjonist' }))
        await userEvent.click(screen.getByRole('button', { name: 'Send tilbakemelding' }))

        expect(onTakk).toHaveBeenCalledTimes(1)
    })
})
