import { describe, it, expect } from 'vitest'

import { BrukerinformasjonDocument } from '../../../fetching/graphql.generated'
import { createInitialQuery, createSykmelding } from '../../../utils/test/dataUtils'
import { render, screen } from '../../../utils/test/testUtils'

import SykmeldingSykmeldtUtenlandsk from './SykmeldingSykmeldtUtenlandsk'

describe('SykmeldingSykmeldtUtenlandsk', () => {
    it('should show country for utenlandsk sykmelding', () => {
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
            {
                initialState: [
                    createInitialQuery(BrukerinformasjonDocument, {
                        __typename: 'Query',
                        brukerinformasjon: { __typename: 'Brukerinformasjon', arbeidsgivere: [] },
                    }),
                ],
            },
        )

        expect(screen.getByRole('heading', { name: 'Landet sykmeldingen ble skrevet i' })).toBeInTheDocument()
        expect(screen.getByText('Finnland')).toBeInTheDocument()
    })
})
