import { ReactElement } from 'react'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import * as R from 'remeda'

import { screen, render } from '../../../../../utils/test/testUtils'
import { toDateString } from '../../../../../utils/dateUtils'

import FrilanserEgenmeldingPerioderField from './FrilanserEgenmeldingPerioderField'

describe('FrilanserEgenmeldingPerioderField', () => {
    const EgenmeldingerFieldInForm = ({ sykmeldingStartDato }: { sykmeldingStartDato: string }): ReactElement => {
        const form = useForm({
            defaultValues: {
                egenmeldingsperioder: [{ fom: null, tom: null }],
            },
        })
        const values = form.watch('egenmeldingsperioder') ?? []

        return (
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(() => void 0)}>
                    <FrilanserEgenmeldingPerioderField sykmeldingStartDato={sykmeldingStartDato} />
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

    it('skal alltid ha en innledende periode', () => {
        render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-01-01" />)

        expect(screen.getByRole('textbox', { name: 'Når ga du beskjed?' })).toBeInTheDocument()
        expect(screen.getAllByRole('textbox')).toHaveLength(1)
        expect(screen.getByTestId('value')).toHaveTextContent('[{"fom":null,"tom":null}]')
    })

    it('skal legge inn periode riktig', async () => {
        render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-03-01" />)

        await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '12.02.2021')

        expect(screen.getByTestId('value')).toHaveTextContent(
            JSON.stringify([{ fom: '2021-02-12', tom: '2021-02-28' }]),
        )
    }, 10_000)

    it('skal vise info-varsel med valgt dato når dato skrives inn', async () => {
        render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-03-01" />)

        await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '12.02.2021')

        expect(await screen.findByText(/Du ga beskjed til Nav 12. februar 2021/)).toBeInTheDocument()
        expect(screen.getByText(/Hvis vi har dokumentasjon på at du ga beskjed fra denne datoen/)).toBeInTheDocument()
    }, 10_000)

    describe('input validation', () => {
        it('skal ikke tillate fom på eller etter sykmeldingStartDato', async () => {
            render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-03-01" />)

            await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '01.03.2021')

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(
                await screen.findByText('Datoen kan ikke være på eller etter sykmeldingens startdato.'),
            ).toBeInTheDocument()
        })

        it('skal ikke tillate fom tidligere enn 16 dager før sykmeldingStartDato (ikke mandag)', async () => {
            render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-02-28" />)

            await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '11.02.2021')

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(
                await screen.findByText('Datoen kan ikke være tidligere enn 16 dager før sykmeldingens startdato.'),
            ).toBeInTheDocument()
        }, 10_000)

        it('skal ikke tillate fom tidligere enn 18 dager før sykmeldingStartDato (mandag)', async () => {
            render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-03-01" />)

            await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '10.02.2021')

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(
                await screen.findByText('Datoen kan ikke være tidligere enn 18 dager før sykmeldingens startdato.'),
            ).toBeInTheDocument()
        }, 10_000)

        it('skal håndheve datoformat', async () => {
            render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-03-01" />)

            await userEvent.type(screen.getByRole('textbox', { name: 'Når ga du beskjed?' }), '13.02.202ø')

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(await screen.findByText('Datoen må være på formatet DD.MM.YYYY.')).toBeInTheDocument()
        })

        it('skal håndheve påkrevde inndatafelter', async () => {
            render(<EgenmeldingerFieldInForm sykmeldingStartDato="2021-03-01" />)

            await userEvent.click(screen.getByRole('button', { name: 'submit for test' }))

            expect(await screen.findByText('Du må fylle inn en dato.')).toBeInTheDocument()
        })
    })
})
