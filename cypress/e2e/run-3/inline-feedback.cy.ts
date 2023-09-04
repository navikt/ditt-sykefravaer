describe('Inline feedback', () => {
    before(() => {
        cy.visit('http://localhost:8080/syk/sykefravaer')
    })

    it('Kan gi ja feedback', () => {
        cy.get('[data-cy="feedback-JA"]').contains('Ja').click()
        cy.get('[data-cy="feedback-JA"]').should('have.css', 'background-color', 'rgb(38, 38, 38)')
        cy.get('[data-cy="feedback-textarea"]').type('Dette er en test')

        cy.get('[data-cy="send-feedback"]').contains('Send tilbakemelding').click()
        cy.contains('Takk for tilbakemeldingen din!')
    })

    it('Kan gi nei feedback', () => {
        cy.get('[data-cy="feedback-NEI"]').contains('Nei').click()
        cy.get('[data-cy="feedback-NEI"]').should('have.css', 'background-color', 'rgb(38, 38, 38)')
        cy.get('[data-cy="feedback-textarea"]').type('Dette er en test')

        cy.get('[data-cy="send-feedback"]').contains('Send tilbakemelding').click()
        cy.contains('Du må gi et svar')
        cy.get('input[value="JA-Skriver"]').check()
        cy.get('[data-cy="send-feedback"]').contains('Send tilbakemelding').click()

        cy.contains('Takk for tilbakemeldingen din!')
    })
})
