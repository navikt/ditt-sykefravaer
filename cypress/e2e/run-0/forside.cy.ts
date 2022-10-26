describe('Tester visning av forside', () => {
    before(() => {
        cy.visit('http://localhost:8080/syk/sykefravaer')
        cy.injectAxe()
    })

    it('Laster startside', () => {
        cy.url().should('equal', 'http://localhost:8080/syk/sykefravaer')
        cy.contains('Du har en ny søknad om sykepenger')
    })

    it('Tester accessibility', () => {
        cy.checkA11y('main')
    })
})

export {}
