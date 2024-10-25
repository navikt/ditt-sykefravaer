import { BodyShort, Button, Heading, LinkPanel, Modal, Popover, Tooltip } from '@navikt/ds-react'
import React, { CSSProperties, useCallback, useRef, useState } from 'react'
import { SandboxIcon } from '@navikt/aksel-icons'

import { PersonaData, PersonaGroupKey, testpersonerGruppert } from '../../data/mock/testperson'

export default function Person() {
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
                    <PersonPicker />
                </Modal.Body>
            </Modal>
        </>
    )
}

function PersonPicker() {
    const testpersoner = testpersonerGruppert()

    return (
        <>
            <Button
                type="button"
                variant="secondary"
                onClick={() => {
                    document.cookie = 'mock-session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/'
                    window.location.reload()
                }}
            >
                Reset testdata
            </Button>

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
