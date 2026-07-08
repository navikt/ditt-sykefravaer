import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { ReactElement } from 'react'
import { IToggle } from '@unleash/nextjs'

import { render, screen } from '../../../../utils/test/testUtils'
import { FlagProvider } from '../../../../toggles/context'

import ArbeidssituasjonField from './ArbeidssituasjonField'

vi.mock('../../../flexjar/AnnetArbeidssituasjonSurvey', () => ({
    AnnetArbeidssituasjonSurvey: () => <div data-testid="annet-survey">survey mock</div>,
}))

const annetSurveyTogglePå: IToggle[] = [
    {
        name: 'flexjar-arbeidssituasjon-annet-survey',
        enabled: true,
        variant: { name: 'disabled', enabled: false },
        impressionData: false,
    },
]

describe('ArbeidssituasjonField', () => {
    const ArbeidssituasjonFieldInForm = ({
        harAvventendePeriode,
        toggles,
    }: {
        harAvventendePeriode: boolean
        toggles?: IToggle[]
    }): ReactElement => {
        const form = useForm({
            defaultValues: {
                arbeidssituasjon: null,
            },
        })

        const innhold = (
            <FormProvider {...form}>
                <ArbeidssituasjonField harAvventendePeriode={harAvventendePeriode} />
                <div data-testid="value">{form.watch('arbeidssituasjon')}</div>
            </FormProvider>
        )

        if (toggles) {
            return <FlagProvider toggles={toggles}>{innhold}</FlagProvider>
        }
        return innhold
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

    it('skal vise info-alert når bruker velger annet og toggle er av', async () => {
        render(<ArbeidssituasjonFieldInForm harAvventendePeriode={false} />)

        await userEvent.click(screen.getByRole('radio', { name: /Annet/i }))

        expect(screen.getByText(/Sykmeldingen gjelder arbeidet du er sykmeldt fra/i)).toBeInTheDocument()
    })

    it('skal vise survey når bruker velger annet og toggle er på', async () => {
        render(<ArbeidssituasjonFieldInForm harAvventendePeriode={false} toggles={annetSurveyTogglePå} />)

        await userEvent.click(screen.getByRole('radio', { name: /Annet/i }))

        expect(screen.getByTestId('annet-survey')).toBeInTheDocument()
        expect(screen.queryByText(/Sykmeldingen gjelder arbeidet du er sykmeldt fra/i)).not.toBeInTheDocument()
    })
})
