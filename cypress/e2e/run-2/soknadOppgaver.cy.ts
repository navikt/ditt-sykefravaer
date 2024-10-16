describe('Tester at oppgaver vises for søknader', () => {
    it('En vanlig søknad for arbeidstaker', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=kun-en-soknad')
        cy.get('[data-testid="oppgaver"]').get(' .navds-alert').contains('Du har en ny søknad om sykepenger')
    })

    it('To nye søknader', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=flere-soknader')
        cy.get('[data-testid="oppgaver"]').get(' .navds-alert').contains('Du har to nye søknader om sykepenger')
    })

    it('Soknad om å beholde sykepengene for reise utenfor EU/EØS', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=ny-soknad-utland-eos')
        cy.get('[data-testid="oppgaver"]')
            .get(' .navds-alert')
            .contains('Du har en ny søknad om å beholde sykepengene for reise utenfor EU/EØS')
            .invoke('attr', 'href')
            .should('include', '/syk/sykepengesoknad/sykepengesoknad-utland')
    })
})
