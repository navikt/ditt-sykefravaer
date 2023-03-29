// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import 'cypress-axe'
import 'cypress-real-events'
import './commands'

afterEach(() => {
    setupAxe()
})

export function setupAxe() {
    cy.injectAxe()
    cy.configureAxe({
        rules: [],
    })

    const A11YOptions = {
        exclude: ['.axe-exclude'],
    }

    cy.checkA11y(A11YOptions, undefined, terminalLog, false)
}

function terminalLog(violations: any) {
    cy.task(
        'log',
        `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} ${
            violations.length === 1 ? 'was' : 'were'
        } detected`,
    )
    // pluck specific keys to keep the table readable
    const violationData = violations.map(({ id, impact, description, nodes }: any) => ({
        id,
        impact,
        description,
        nodes: nodes.length,
    }))

    cy.task('table', violationData)
}
