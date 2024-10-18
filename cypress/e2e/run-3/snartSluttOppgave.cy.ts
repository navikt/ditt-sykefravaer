describe('Tester snart slutt oppgave ', () => {
    it('Har riktig lenke', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')

        cy.contains('Snart slutt på sykepengene')
        cy.get('[data-testid="oppgaver"]')
            .should('have.length', '1')
            .first()
            .contains('Snart slutt på sykepengene')
            .should('have.attr', 'href', 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene')
    })
})
