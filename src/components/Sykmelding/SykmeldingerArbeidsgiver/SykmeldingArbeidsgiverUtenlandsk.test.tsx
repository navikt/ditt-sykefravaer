import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { createSykmelding } from '../../../utils/test/dataUtils'

import SykmeldingArbeidsgiverUtenlandsk from './SykmeldingArbeidsgiverUtenlandsk'

describe('SykmeldingArbeidsgiverUtenlandsk', () => {
    it('skal vise land for utenlandsk sykmelding', () => {
        render(
            <SykmeldingArbeidsgiverUtenlandsk
                sykmelding={{
                    ...createSykmelding(),
                    utenlandskSykmelding: {
                        land: 'Polen',
                    },
                }}
            />,
        )

        expect(screen.getByRole('heading', { name: 'Landet sykmeldingen ble skrevet i' })).toBeInTheDocument()
        expect(screen.getByText('Polen')).toBeInTheDocument()
    })
})
