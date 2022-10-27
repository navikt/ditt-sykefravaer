describe('Tester helt frisk person', () => {
    before(() => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=helt-frisk')
        cy.injectAxe()
    })

    it('Laster startside', () => {
        cy.url().should('contain', 'http://localhost:8080/syk/sykefravaer')
    })

    it('Har veildertekst om papirsykmelding', () => {
        cy.contains('Du har ingen digital sykmelding.')
        cy.contains('Har du fått sykmeldingen på papir, kan du vente noen dager, så vil du finne den her.')
        cy.get('.navds-guide-panel__content > a').should(
            'have.attr',
            'href',
            'https://www.nav.no/no/person/arbeid/sykmeldt-arbeidsavklaringspenger-og-yrkesskade/papirsykmelding',
        )
    })

    it('Tester accessibility', () => {
        cy.checkA11y('main')
    })
})

export {}
