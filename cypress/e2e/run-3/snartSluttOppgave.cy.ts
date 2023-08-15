describe('Tester snart slutt oppgave ', () => {
    it('Har riktig lenke', () => {
        cy.clearCookies()

        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')

        cy.get('[data-cy="oppgaver"]')
            .children()
            .eq(1)
            .contains('Snart slutt på sykepengene')
            .should('have.attr', 'href', 'https://demo.ekstern.dev.nav.no/syk/info/snart-slutt-pa-sykepengene')
    })
})

export {}
