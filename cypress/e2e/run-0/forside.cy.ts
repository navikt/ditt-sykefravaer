describe('Tester visning av forside', () => {
    before(() => {
        cy.clearCookies()

        cy.visit('http://localhost:8080/syk/sykefravaer')
    })

    it('Laster startside', () => {
        cy.url().should('equal', 'http://localhost:8080/syk/sykefravaer')
        cy.contains('Du har en ny søknad om sykepenger')
    })
})

export {}
