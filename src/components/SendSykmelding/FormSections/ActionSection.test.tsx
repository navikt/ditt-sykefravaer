import { ReactElement, ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { UseMutationResult } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

import { ArbeidssituasjonType } from '../../../types/sykmelding/sykmeldingCommon'
import { SendSykmeldingMutation } from '../../../hooks/sykmelding/useSendSykmelding'
import { FormValues } from '../SendSykmeldingForm'

import ActionSection from './ActionSection'

const { useIsSubmitLockedMock } = vi.hoisted(() => ({
    useIsSubmitLockedMock: vi.fn<() => boolean>(),
}))

vi.mock('./shared/LockSubmitContext', () => ({
    useIsSubmitLocked: useIsSubmitLockedMock,
}))

type SendResult = UseMutationResult<SendSykmeldingMutation, unknown, FormValues, unknown>

function createSendResult(overrides: Partial<SendResult>): SendResult {
    return {
        isPending: false,
        isError: false,
        mutate: vi.fn(),
        ...overrides,
    } as SendResult
}

function FormWrapper({ children }: { children: ReactNode }): ReactElement {
    const form = useForm<FormValues>({
        defaultValues: {
            arbeidssituasjon: ArbeidssituasjonType.ARBEIDSTAKER,
            uriktigeOpplysninger: null,
            fisker: { blad: null, lottOgHyre: null },
        },
    })

    return <FormProvider {...form}>{children}</FormProvider>
}

function renderActionSection(sendResult: SendResult): void {
    render(
        <FormWrapper>
            <ActionSection sykmeldingId="123" sendResult={sendResult} onSykmeldingAvbrutt={vi.fn()} />
        </FormWrapper>,
    )
}

describe('ActionSection', () => {
    it('deaktiverer send-knappen når innsending pågår (isPending)', () => {
        useIsSubmitLockedMock.mockReturnValue(false)
        renderActionSection(createSendResult({ isPending: true }))

        expect(screen.getByRole('button', { name: /Send sykmelding/ })).toBeDisabled()
    })

    it('deaktiverer send-knappen når useIsSubmitLocked er true', () => {
        useIsSubmitLockedMock.mockReturnValue(true)
        renderActionSection(createSendResult({ isPending: false }))

        expect(screen.getByRole('button', { name: /Send sykmelding/ })).toBeDisabled()
    })

    it('deaktiverer send-knappen når både innsending pågår og useIsSubmitLocked er true', () => {
        useIsSubmitLockedMock.mockReturnValue(true)
        renderActionSection(createSendResult({ isPending: true }))

        expect(screen.getByRole('button', { name: /Send sykmelding/ })).toBeDisabled()
    })

    it('lar send-knappen være aktiv når verken innsending pågår eller useIsSubmitLocked er true', () => {
        useIsSubmitLockedMock.mockReturnValue(false)
        renderActionSection(createSendResult({ isPending: false }))

        expect(screen.getByRole('button', { name: /Send sykmelding/ })).toBeEnabled()
    })
})
