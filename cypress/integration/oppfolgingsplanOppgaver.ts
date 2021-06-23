describe('Tester oppfølgingsplan oppgaver', () => {

    it('En oppgave sammen', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=en-oppfolgingsplan-til-godkjenning')
        cy.get('.oppgaver > .alertstripe').contains('Lederen din har begynt på oppfølgingsplanen dere skal skrive sammen')
    })
})
