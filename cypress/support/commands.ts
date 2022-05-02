// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        interface Chainable<Subject = any> {
            isNotInViewport(element: string): Chainable<Subject>
            isInViewport(element: string): Chainable<Subject>
        }
    }
}

export function isNotInViewport(element: string) {
    return cy.get(element).should(($el) => {
        /* eslint-disable-next-line */
        // @ts-ignore
        const bottom = Cypress.$(cy.state('window')).height() || 0
        const rect = $el[0].getBoundingClientRect()

        expect(rect.top).to.be.greaterThan(bottom)
        expect(rect.bottom).to.be.greaterThan(bottom)
        expect(rect.top).to.be.greaterThan(bottom)
        expect(rect.bottom).to.be.greaterThan(bottom)
    })
}

export function isInViewport(element: string) {
    return cy.get(element).should(($el) => {
        /* eslint-disable-next-line */
        // @ts-ignore
        const bottom = Cypress.$(cy.state('window')).height() || 0
        const rect = $el[0].getBoundingClientRect()

        expect(rect.top).not.to.be.greaterThan(bottom)
        expect(rect.bottom).not.to.be.greaterThan(bottom)
        expect(rect.top).not.to.be.greaterThan(bottom)
        expect(rect.bottom).not.to.be.greaterThan(bottom)
    })
}

Cypress.Commands.add('isNotInViewport', isNotInViewport)
Cypress.Commands.add('isInViewport', isInViewport)
