import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { ReactElement } from 'react'

import { render, screen } from '../../../../utils/test/testUtils'

import ArbeidssituasjonField from './ArbeidssituasjonField'

describe('ArbeidssituasjonField', () => {
    const ArbeidssituasjonFieldInForm = ({ harAvventendePeriode }: { harAvventendePeriode: boolean }): ReactElement => {
        const form = useForm({
            defaultValues: {
                arbeidssituasjon: null,
            },
        })

        return (
            <FormProvider {...form}>
                <ArbeidssituasjonField harAvventendePeriode={harAvventendePeriode} />
                <div data-testid="value">{form.watch('arbeidssituasjon')}</div>
            </FormProvider>
        )
    }

    it('skal ikke deaktivere felter når harAvventendePeriode er false', async () => {
        render(<ArbeidssituasjonFieldInForm harAvventendePeriode={false} />)

        await userEvent.click(screen.getByRole('radio', { name: /Permittert/i }))

        expect(screen.getByRole('radio', { name: /Permittert/i })).not.toBeDisabled()
        expect(screen.getByRole('radio', { name: /Permittert/i })).toBeChecked()
        expect(screen.getByTestId('value')).toHaveTextContent('PERMITTERT')
    })

    it('skal deaktivere alt unntatt ansatt når harAvventendePeriode er true', () => {
        render(<ArbeidssituasjonFieldInForm harAvventendePeriode />)

        expect(screen.getByRole('radio', { name: /Ansatt/i })).not.toBeDisabled()
        expect(screen.getByRole('radio', { name: /Permittert/i })).toBeDisabled()
        expect(screen.getByRole('radio', { name: /Frilanser/i })).toBeDisabled()
        expect(screen.getByRole('radio', { name: /Selvstendig næringsdrivende/i })).toBeDisabled()
        expect(screen.getByRole('radio', { name: /Arbeidsledig/i })).toBeDisabled()
        expect(screen.getByRole('radio', { name: /Annet/i })).toBeDisabled()
    })

    it('skal vise info-alert når bruker velger annet', async () => {
        render(<ArbeidssituasjonFieldInForm harAvventendePeriode={false} />)

        await userEvent.click(screen.getByRole('radio', { name: /Annet/i }))

        expect(screen.getByText(/Sykmeldingen gjelder arbeidet du er sykmeldt fra/i)).toBeInTheDocument()
    })
})
