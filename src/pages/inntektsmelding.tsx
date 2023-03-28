import { Back } from '@navikt/ds-icons'
import { BodyLong, Heading, Panel } from '@navikt/ds-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { parserWithReplace } from '../utils/html-react-parser-utils'
import { beskyttetSideUtenProps } from '../auth/beskyttetSide'
import Person from '../components/person/Person'
import { useUpdateBreadcrumbs } from '../hooks/useBreadcrumbs'
import { setBodyClass } from '../utils/setBodyClass'
import { tekst } from '../utils/tekster'

const Inntektsmelding = () => {
    const router = useRouter()
    useUpdateBreadcrumbs(
        () => [{ title: 'Ditt sykefravær', url: '/', handleInApp: true }, { title: 'Manglende inntektsmelding' }],
        [],
    )

    useEffect(() => {
        setBodyClass('inntektsmelding')
    }, [])

    return (
        <>
            <header className="sidebanner">
                <div>
                    <img
                        className="sidebanner__ikon"
                        src="/syk/sykefravaer/static/ditt-sykefravaer-ikon.svg"
                        width={64}
                        height={64}
                        alt=""
                    />
                    <Heading level="1" size="xlarge" className="sidebanner__tittel">
                        {tekst('inntektsmelding.side-tittel-manglende')}
                    </Heading>
                </div>
                <Person />
            </header>

            <div className="limit">
                <Heading level="2" size="medium">
                    {tekst('inntektsmelding.side-tittel', {
                        '%ARBEIDSGIVER%': 'Test Arbeidsgiver AS',
                    })}
                </Heading>

                <BodyLong spacing className="forklaring-bodylong">
                    {parserWithReplace(tekst('inntektsmelding.arbeidsgiver-har-fatt-beskjed'))}
                </BodyLong>

                <Panel className="tekstbakgrunn">
                    <Heading level="2" size="small">
                        {tekst('inntektsmelding.soknaden-kan-ikke-behandles.tittel')}
                    </Heading>
                    <BodyLong>{parserWithReplace(tekst('inntektsmelding.soknaden-kan-ikke-behandles'))}</BodyLong>
                </Panel>

                <Panel className="tekstbakgrunn">
                    <Heading level="2" size="small">
                        {tekst('inntekstmelding.hvorfor.varsler.vi.tittel')}
                    </Heading>
                    <BodyLong spacing>{parserWithReplace(tekst('inntekstmelding.hvorfor.varsler.vi1'))}</BodyLong>
                    <BodyLong>{parserWithReplace(tekst('inntekstmelding.hvorfor.varsler.vi2'))}</BodyLong>
                </Panel>

                <Panel className="tekstbakgrunn">
                    <Heading level="2" size="small">
                        {tekst('inntektsmelding.hva-er-inntekysmeldingen-tittel')}
                    </Heading>
                    <BodyLong>{tekst('inntektsmelding.hva-er-inntekysmeldingen-forklaring')}</BodyLong>
                </Panel>

                <Link href="/">
                    <a
                        className="lenke"
                        onClick={(e) => {
                            e.preventDefault()
                            router.push('/')
                        }}
                    >
                        <Back style={{ marginBottom: '-4px' }} title={'Til ditt sykefravær'} />
                        <BodyLong as="span">{tekst('sidetittel.liste')}</BodyLong>
                    </a>
                </Link>
            </div>
        </>
    )
}

export const getServerSideProps = beskyttetSideUtenProps

export default Inntektsmelding
