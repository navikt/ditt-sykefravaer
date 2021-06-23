describe('Tester oppfølgingsplan oppgaver', () => {

    it('En ny oppgave', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=en-ny-oppfolgingsplan')
        cy.get('.oppgaver > .alertstripe').contains('Lederen din har begynt på oppfølgingsplanen dere skal skrive sammen')
    })

    it('To nye oppgaver', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=to-nye-oppfolgingsplaner')
        cy.get('.oppgaver > .alertstripe').contains('Det er startet to oppfølgingsplaner du er en del av')
    })

    it('En til godkjenning', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=en-ny-oppfolgingsplan-til-godkjenning')
        cy.get('.oppgaver > .alertstripe').contains('Du har en oppfølgingsplan som venter på godkjenning av deg')
    })

    it('To til godkjenning', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=to-nye-oppfolgingsplaner-til-godkjenning')
        cy.get('.oppgaver > .alertstripe').contains('Du har to oppfølgingsplaner som venter på godkjenning av deg')
    })
})
