describe('Tester cummulative-layout-shift ', () => {
    it('Høyden endres ikke i happy case etter at dataene er lastet', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=cummulative-layout-shift')
        cy.get('h1').should('be.visible')
        cy.get('.navds-skeleton').should('have.length', 6)

        // Sjekk dokumentets høyde
        const expectedHeight = 1419
        cy.window().then((win) => {
            const docHeight = win.document.documentElement.scrollHeight
            expect(docHeight).to.equal(expectedHeight)
        })

        // Venter på at alle dataene er fetchet og rendret
        cy.contains('Du har en ny sykmelding').should('be.visible')
        cy.get('.navds-skeleton').should('have.length', 0)

        cy.window().then((win) => {
            const docHeight = win.document.documentElement.scrollHeight
            expect(docHeight).to.equal(expectedHeight)
        })
    })
})
