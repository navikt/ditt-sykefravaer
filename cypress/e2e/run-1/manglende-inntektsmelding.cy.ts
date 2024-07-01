describe('Tester inntektsmelding', () => {
    it('Har inntektsmelding varsel og riktig innhold', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mangler-inntektsmelding')

        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .should('have.length', 1)
            .contains('Vi venter på inntektsmeldingen fra Matbutikken AS for sykefraværet som startet 1. juni 2022.')
            .click()

        cy.url().should('contain', 'http://localhost:8080/syk/sykefravaer/inntektsmelding')

        cy.get('h1').contains('Vi venter på inntektsmelding fra arbeidsgiver').and('is.visible')

        cy.contains('Vi har ikke mottatt inntektsmelding fra arbeidsgiveren din')
        cy.contains('for å vurdere om du har rett til sykepenger')
    })

    it('Mottatt inntektsmelding varsel kan lukkes', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mottatt-inntektsmelding')

        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .should('have.length', 1)
            .and(
                'include.text',
                'Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefraværet som startet 15. mars 2022.',
            )

        cy.get('[data-cy="oppgaver"]').find('.navds-alert .navds-button').click()

        cy.get('[data-cy="oppgaver"]').should('not.exist')
    })
})
