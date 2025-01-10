import { Alert, BodyShort, Button, Heading, LinkPanel, Modal, Popover, Tooltip } from '@navikt/ds-react'
import React, { CSSProperties, ReactElement, useCallback, useRef, useState } from 'react'
import { SandboxIcon } from '@navikt/aksel-icons'
import * as R from 'remeda'

import { cn } from '../../utils/tw-utils'
import { PersonaData, PersonaGroupKey, testpersonerGruppert } from '../../data/mock/testperson'
import { otherScenarios, Scenarios, simpleScenarios } from '../../data/mock/mock-db/scenarios'

export default function Person({ side }: { side: 'dittsykefravaer' | 'sykmelding' }): ReactElement {
    const [showHint, setShowHint] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [openState, setOpenState] = useState(false)

    const dismissHint = useCallback(() => {
        localStorage.setItem('devtools-hint', 'false')
        setShowHint(false)
    }, [])

    return (
        <>
            <div hidden={openState}>
                <Tooltip content="Verktøy for testing">
                    <Button
                        ref={buttonRef}
                        onClick={() => setOpenState((b) => !b)}
                        icon={<SandboxIcon title="Åpne testdataverktøy" />}
                        variant="tertiary-neutral"
                    />
                </Tooltip>
                <div
                    style={
                        {
                            '--ac-popover-bg': 'var(--a-surface-info-subtle)',
                            '--ac-popover-border': 'var(--a-border-info)',
                        } as CSSProperties
                    }
                >
                    <Popover open={showHint} onClose={() => void 0} placement="bottom-end" anchorEl={buttonRef.current}>
                        <Popover.Content>
                            <Heading size="small" level="3" className="motion-safe:animate-bounce">
                                Tips!
                            </Heading>
                            <div className="w-[220px]">
                                Her finner du verktøy for å endre mellom forskjellige brukere
                            </div>
                            <Button onClick={dismissHint} className="mt-2" variant="secondary-neutral" size="small">
                                OK!
                            </Button>
                        </Popover.Content>
                    </Popover>
                </div>
            </div>
            <Modal
                open={openState}
                onClose={() => {
                    if (showHint) dismissHint()
                    setOpenState(false)
                }}
                className="h-screen max-h-max max-w-[369px] rounded-none p-0 left-auto m-0"
                header={{
                    heading: 'Testdataverktøy',
                }}
            >
                <Modal.Body>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            document.cookie = 'mock-session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/'
                            document.cookie = 'next-session-id= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/'
                            window.location.reload()
                        }}
                    >
                        Reset testdata
                    </Button>
                    {side === 'dittsykefravaer' && <PersonPicker />}
                    {side === 'sykmelding' && <SykmeldingPicker />}
                </Modal.Body>
            </Modal>
        </>
    )
}

function SykmeldingPicker() {
    const handleChangeUserScenario = (scenario: Scenarios) => async () => {
        const searchParams = new URLSearchParams({
            scenario,
        })

        window.location.href = `/syk/sykefravaer/sykmelding/?${searchParams.toString()}`
    }

    return (
        <div>
            <Alert variant="warning" size="small" className="mt-2" inline role="status">
                Endring av scenario vil slette eventuelle innsendinger og endringer du har gjort.
            </Alert>
            <Heading size="small" level="4" className="mt-2">
                Vanlige scenarioer
            </Heading>
            <ul className={cn('mt-2 flex flex-col gap-2', {})}>
                {R.entries(simpleScenarios).map(([key, { description }]) => {
                    return (
                        <li key={key} className="list-none">
                            <LinkPanel
                                as="button"
                                onClick={handleChangeUserScenario(key)}
                                className="w-full text-start"
                            >
                                {description}
                            </LinkPanel>
                        </li>
                    )
                })}
            </ul>
            <Heading size="small" level="4" className="mt-2">
                Andre scenarioer
            </Heading>
            <ul className={cn('mt-2 flex flex-col gap-2', {})}>
                {R.entries(otherScenarios).map(([key, { description }]) => {
                    return (
                        <li key={key} className="list-none">
                            <LinkPanel
                                as="button"
                                onClick={handleChangeUserScenario(key)}
                                className="w-full text-start"
                            >
                                {description}
                            </LinkPanel>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

function PersonPicker() {
    const testpersoner = testpersonerGruppert()

    return (
        <>
            {Object.entries(testpersoner).map(([gruppe, personer]) => (
                <PersonGruppeVisning gruppe={gruppe as PersonaGroupKey} personer={personer} key={gruppe} />
            ))}
        </>
    )
}

function PersonGruppeVisning({ gruppe, personer }: { gruppe: PersonaGroupKey; personer: PersonaData }) {
    function heading() {
        switch (gruppe) {
            case 'blanding': {
                return 'Helt frisk og med masse greier'
            }
            case 'soknader-og-sykmeldinger': {
                return 'Søknad og sykmelding'
            }
            case 'oppgaver': {
                return 'Oppgaver på ditt-sykefravær'
            }
            case 'varsler': {
                return 'Varsler om forsinket saksbehandling'
            }
            case 'testing': {
                return 'Diverse personer for testing'
            }
            case 'maksdato': {
                return 'Personer med maksdato'
            }
            default: {
                throw Error(`mangler testperson gruppe heading for ${gruppe}`)
            }
        }
    }

    return (
        <>
            <Heading size="small" level="4" className="mt-2">
                {heading()}
            </Heading>
            <ul className="mt-2 flex flex-col gap-2">
                {Object.entries(personer).map(([key, person]) => (
                    <LinkPanel key={key} className="w-full text-start" href={`/syk/sykefravaer?testperson=${key}`}>
                        <BodyShort>{person.beskrivelse}</BodyShort>
                    </LinkPanel>
                ))}
            </ul>
        </>
    )
}
