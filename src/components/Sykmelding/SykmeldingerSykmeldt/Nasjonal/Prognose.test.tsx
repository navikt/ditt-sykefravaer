import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Prognose } from '../../../../types/sykmelding/sykmelding'

import PrognoseSykmeldt from './Prognose'

describe('Prognose', () => {
    it('Viser seksjonstittelen', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)
        expect(screen.getByText('Prognose')).toBeInTheDocument()
    })

    it('Viser ikke seksjon hvis arbeidsforEtterPeriode er false og alle andre egenskaper er null', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: false,
            hensynArbeidsplassen: null,
            erIkkeIArbeid: null,
            erIArbeid: null,
        }
        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)

        expect(screen.queryByText('Friskmelding/Prognose')).not.toBeInTheDocument()
    })

    it('Viser arbeidsforEtterPeriode hvis true', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)
        expect(screen.getByText('Er pasienten 100% arbeidsfør etter denne perioden?')).toBeInTheDocument()
    })

    it('Viser ikke arbeidsforEtterPeriode hvis false', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: false,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)
        expect(screen.queryByText('Er pasienten 100% arbeidsfør etter denne perioden?')).not.toBeInTheDocument()
    })

    it('Viser hensynArbeidsplassen', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: null,
            erIkkeIArbeid: null,
        }
        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)
        expect(screen.getByText('Hensyn som må tas på arbeidsplassen')).toBeInTheDocument()
        expect(screen.getByText('hensyn på arbeidsplassen')).toBeInTheDocument()
    })

    it('Viser erIArbeid egetArbeidPaSikt true', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: {
                egetArbeidPaSikt: true,
                annetArbeidPaSikt: false,
                arbeidFOM: '2021-04-10',
                vurderingsdato: '2021-04-15',
            },
            erIkkeIArbeid: null,
        }
        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)
        expect(
            screen.getByText('Antas pasienten å kunne komme tilbake til samme arbeidsgiver på sikt?'),
        ).toBeInTheDocument()
        expect(
            screen.queryByText('Antas pasienten å kunne komme tilbake til annen arbeidsgiver på sikt?'),
        ).not.toBeInTheDocument()

        expect(screen.getByText('Pasienten anslås å være tilbake')).toBeInTheDocument()
        expect(screen.getByText('10. april 2021')).toBeInTheDocument()

        expect(screen.getByText('Behandler kan gi tilbakemelding på dette')).toBeInTheDocument()
        expect(screen.getByText('15. april 2021')).toBeInTheDocument()
    })

    it('Viser erIArbeid annetArbeidPaSikt true', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIArbeid: {
                egetArbeidPaSikt: false,
                annetArbeidPaSikt: true,
                arbeidFOM: '2021-04-10',
                vurderingsdato: '2021-04-15',
            },
            erIkkeIArbeid: null,
        }

        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)

        expect(
            screen.getByText('Antas pasienten å kunne komme tilbake til annen arbeidsgiver på sikt?'),
        ).toBeInTheDocument()
        expect(
            screen.queryByText('Antas pasienten å kunne komme tilbake til samme arbeidsgiver på sikt?'),
        ).not.toBeInTheDocument()

        expect(screen.getByText('Pasienten anslås å være tilbake')).toBeInTheDocument()
        expect(screen.getByText('10. april 2021')).toBeInTheDocument()

        expect(screen.getByText('Behandler kan gi tilbakemelding på dette')).toBeInTheDocument()
        expect(screen.getByText('15. april 2021')).toBeInTheDocument()
    })

    it('Viser erIkkeIArbeid arbeidsforPaSikt true', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIkkeIArbeid: {
                arbeidsforPaSikt: true,
                arbeidsforFOM: '2021-04-10',
                vurderingsdato: '2021-04-15',
            },
            erIArbeid: null,
        }
        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)
        expect(screen.getByText('Antas pasienten å kunne komme i arbeid på sikt?')).toBeInTheDocument()

        expect(screen.getByText('Pasienten anslås å vær være arbeidsfør')).toBeInTheDocument()
        expect(screen.getByText('10. april 2021')).toBeInTheDocument()

        expect(screen.getByText('Behandler kan gi tilbakemelding på dette')).toBeInTheDocument()
        expect(screen.getByText('15. april 2021')).toBeInTheDocument()
    })

    it('Viser erIkkeIArbeid når arbeidsforPaSikt er false', () => {
        const prognose: Prognose = {
            arbeidsforEtterPeriode: true,
            hensynArbeidsplassen: 'hensyn på arbeidsplassen',
            erIkkeIArbeid: {
                arbeidsforPaSikt: false,
                vurderingsdato: '2021-04-15',
                arbeidsforFOM: null,
            },
            erIArbeid: null,
        }

        render(<PrognoseSykmeldt prognose={prognose} isV3={false} parentId="test" />)

        expect(screen.queryByText('Antas pasienten å kunne komme i arbeid på sikt?')).not.toBeInTheDocument()
        expect(screen.getByText('Behandler kan gi tilbakemelding på dette')).toBeInTheDocument()
        expect(screen.getByText('15. april 2021')).toBeInTheDocument()
    })
})
