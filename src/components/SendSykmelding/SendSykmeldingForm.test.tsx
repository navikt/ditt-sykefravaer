import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createSykmelding } from '../../utils/test/dataUtils'

import SendSykmeldingForm from './SendSykmeldingForm'

const { sendSykmelding } = vi.hoisted(() => ({ sendSykmelding: vi.fn() }))

vi.mock('../../hooks/useGetSykmeldingIdParam', () => ({ default: () => 'test-sykmelding' }))
vi.mock('../../hooks/useWarnUnsaved', () => ({ default: vi.fn() }))
vi.mock('../../hooks/sykmelding/useBrukerinformasjonById', () => ({
    default: () => ({ data: {}, isLoading: false }),
}))
vi.mock('../../hooks/sykmelding/useSendSykmelding', () => ({
    useSendSykmelding: () => ({ mutate: sendSykmelding, isPending: false, isError: false }),
}))
vi.mock('../umami/umami', () => ({ logUmamiEvent: vi.fn(), useLogUmamiEvent: vi.fn() }))
vi.mock('../../utils/environment', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../../utils/environment')>()),
    autofillEnabled: () => false,
}))
vi.mock('next/dynamic', () => ({ default: () => () => null }))
vi.mock('./FormSections/Arbeidssituasjon/ArbeidssituasjonSection', () => ({ default: () => null }))

describe('SendSykmeldingForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('flytter fokus til feiloppsummeringen ved hver ugyldige innsending', async () => {
        const bruker = userEvent.setup()
        render(<SendSykmeldingForm sykmelding={createSykmelding()} onSykmeldingAvbrutt={vi.fn()} />)

        const sendKnapp = screen.getByRole('button', { name: 'Bekreft sykmelding' })
        await bruker.click(sendKnapp)

        const feiloppsummering = await screen.findByRole('heading', {
            name: 'Du må fylle ut disse feltene før du kan registrere sykmeldingen.',
        })
        await waitFor(() => expect(feiloppsummering).toHaveFocus())
        expect(
            screen.getByRole('link', { name: 'Du må svare på om opplysningene i sykmeldingen er riktige.' }),
        ).toBeInTheDocument()
        expect(sendSykmelding).not.toHaveBeenCalled()

        await bruker.click(sendKnapp)

        await waitFor(() => expect(feiloppsummering).toHaveFocus())
        expect(sendSykmelding).not.toHaveBeenCalled()
    })

    it('sender gyldig skjema uten å vise feiloppsummeringen', async () => {
        const bruker = userEvent.setup()
        render(<SendSykmeldingForm sykmelding={createSykmelding()} onSykmeldingAvbrutt={vi.fn()} />)

        await bruker.click(screen.getByRole('radio', { name: 'Ja' }))
        await bruker.click(screen.getByRole('button', { name: 'Bekreft sykmelding' }))

        await waitFor(() => expect(sendSykmelding).toHaveBeenCalledTimes(1))
        expect(
            screen.queryByRole('heading', {
                name: 'Du må fylle ut disse feltene før du kan registrere sykmeldingen.',
            }),
        ).not.toBeInTheDocument()
    })
})
