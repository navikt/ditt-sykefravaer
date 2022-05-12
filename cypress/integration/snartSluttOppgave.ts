describe('Tester snart slutt oppgave ', () => {
    it('Har riktig lenke', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')
        cy.get('.oppgaver > .navds-alert--warning')
            .contains('Snart slutt på sykepengene')
            .should(
                'have.attr',
                'href',
                'https://esyfo-info-frontend.labs.nais.io/syk/info/snart-slutt-pa-sykepengene'
            )
    })
})

export {}
