import { describe, it, expect } from 'vitest'

import { createSykmelding } from '../../../utils/test/dataUtils'
import { render, screen } from '../../../utils/test/testUtils'

import SykmeldingSykmeldtUtenlandsk from './SykmeldingSykmeldtUtenlandsk'

describe('SykmeldingSykmeldtUtenlandsk', () => {
    it('skal vise land for utenlandsk sykmelding', () => {
        render(
            <SykmeldingSykmeldtUtenlandsk
                sykmelding={{
                    ...createSykmelding(),
                    utenlandskSykmelding: {
                        land: 'Finnland',
                    },
                }}
                shouldShowEgenmeldingsdagerInfo={false}
            />,
        )

        expect(screen.getByRole('heading', { name: 'Landet sykmeldingen ble skrevet i' })).toBeInTheDocument()
        expect(screen.getByText('Finnland')).toBeInTheDocument()
    })
})
