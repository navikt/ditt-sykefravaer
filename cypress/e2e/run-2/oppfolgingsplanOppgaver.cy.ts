describe('Tester oppfølgingsplan oppgaver', () => {
    it('En ny oppgave', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=en-ny-oppfolgingsplan')
        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .contains('Arbeidsgiveren din har begynt på en oppfølgingsplan. Du skal fylle ut din del.')
    })

    it('To nye oppgaver', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=to-nye-oppfolgingsplaner')
        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .contains('Arbeidsgiverne dine har begynt på hver sin oppfølgingsplan. Du skal fylle ut din del.')
    })

    it('En til godkjenning', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=en-ny-oppfolgingsplan-til-godkjenning')
        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .contains('Du har en oppfølgingsplan som venter på godkjenning av deg')
    })

    it('To til godkjenning', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=to-nye-oppfolgingsplaner-til-godkjenning')
        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .contains('Du har to oppfølgingsplaner som venter på godkjenning av deg')
    })
})

export {}
