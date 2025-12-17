import { ReactElement } from 'react'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import * as R from 'remeda'

import { screen, render } from '../../../../../utils/test/testUtils'
import { toDateString } from '../../../../../utils/dateUtils'

import FrilanserEgenmeldingPerioderField from './FrilanserEgenmeldingPerioderField'

describe('FrilanserEgenmeldingPerioderField', () => {
    const EgenmeldingerFieldInForm = ({ oppfolgingsdato }: { oppfolgingsdato: string }): ReactElement => {
        const form = useForm({
            defaultValues: {
                egenmeldingsperioder: [{ fom: null, tom: null }],
            },
        })
        const values = form.watch('egenmeldingsperioder') ?? []

        return (
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(() => void 0)}>
                    <FrilanserEgenmeldingPerioderField oppfolgingsdato={oppfolgingsdato} />
                    <button type="submit">submit for test</button>
                    <div data-testid="value">
                        {JSON.stringify(
                            R.map(
                                values,
                                R.mapValues((it) => it && toDateString(it)),
                            ),
                        )}
                    </div>
                </form>
            </FormProvider>
        )
    }

    it('should always have an initial period', () => {
        render(<EgenmeldingerFieldInForm oppfolgingsdato="2021-01-01" />)

        expect(screen.getByRole('textbox', { name: 'Når ga du beskjed?' })).toBeInTheDocument()
        expect(screen.getAllByRole('textbox')).toHaveLength(1)
        expect(screen.getByTestId('value')).toHaveTextContent('[{"fom":null,"tom":null}]')
    })

    it('should input multiple periods correctly', async () => {
        render(<EgenmeldingerFieldInForm oppfolgingsdato="2021-03-01" />)

        await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '12.02.2021')

        expect(screen.getByTestId('value')).toHaveTextContent(
            JSON.stringify([{ fom: '2021-02-12', tom: '2021-02-28' }]),
        )
    }, 10_000)

    it('should remove period', async () => {
        render(<EgenmeldingerFieldInForm oppfolgingsdato="2021-03-01" />)

        await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '12.02.2021')

        expect(screen.getByTestId('value')).toHaveTextContent(
            JSON.stringify([{ fom: '2021-02-12', tom: '2021-02-28' }]),
        )
    }, 10_000)

    describe('input validation', () => {
        it('should not allow fom on or after oppfolgingsdato', async () => {
            render(<EgenmeldingerFieldInForm oppfolgingsdato="2021-03-01" />)

            await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '01.03.2021')

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(await screen.findByText('Datoen kan ikke være oppfølgingsdato eller senere.')).toBeInTheDocument()
        })

        it('should enforce date format', async () => {
            render(<EgenmeldingerFieldInForm oppfolgingsdato="2021-03-01" />)

            await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '13.02.202ø')

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(await screen.findByText('Datoen må være på formatet DD.MM.YYYY.')).toBeInTheDocument()
        })

        it('should enforce required inputs', async () => {
            render(<EgenmeldingerFieldInForm oppfolgingsdato="2021-03-01" />)

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(await screen.findByText('Du må fylle inn en dato.')).toBeInTheDocument()
        })
    })
})
