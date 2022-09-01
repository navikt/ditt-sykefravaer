describe('Tester inntektsmelding', () => {
    it('Har inntektsmelding varsel og riktig innhold', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mangler-inntektsmelding')
        cy.injectAxe()

        cy.get('.oppgaver > .navds-alert')
            .should('have.length', 1)
            .contains(
                'Vi mangler inntektsmeldingen fra Test Arbeidsgiver AS for sykefraværet som startet 1. juni 2022.'
            )
            .click()

        cy.url().should('contain', 'http://localhost:8080/syk/sykefravaer/inntektsmelding')
        cy.injectAxe()

        cy.get('.tekstbakgrunn .navds-body-long')
            .should(
                'contain',
                'Vi har også varslet jobben din, men hvis du er usikker, bør du kontakte jobben og gi beskjed om at de må sende inntektsmeldingen til oss så snart som mulig.'
            )
            .should(
                'contain',
                'Vi kan ikke behandle søknaden din om sykepenger før vi har mottatt inntektsmeldingen. ' +
                    'Det vil si at hvis du får sykepenger fra NAV, kan vi ikke utbetale dem før vi har behandlet søknaden ferdig.'
            )

        cy.checkA11y()
    })

    it('Mottatt inntektsmelding varsel kan lukkes', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mottatt-inntektsmelding')
        cy.injectAxe()

        cy.get('.oppgaver > .navds-alert')
            .should('have.length', 1)
            .contains(
                ' Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefraværet som startet 15. mars 2022.'
            )
        cy.checkA11y()

        cy.get('.oppgaver > .navds-alert').get('.navds-button').click()

        cy.get('.oppgaver > .navds-alert').should('have.length', 0)
        cy.checkA11y()
    })
})

export {}
