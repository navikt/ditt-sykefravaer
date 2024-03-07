describe('Tester inntektsmelding', () => {
    it('Har inntektsmelding varsel og riktig innhold', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mangler-inntektsmelding')

        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .should('have.length', 1)
            .contains(
                'Saksbehandlingen er forsinket fordi vi mangler inntektsmeldingen fra Test Arbeidsgiver AS for sykefraværet som startet 1. juni 2022.',
            )
            .click()

        cy.url().should('contain', 'http://localhost:8080/syk/sykefravaer/inntektsmelding')

        cy.get('h2').contains('Vi mangler inntektsmelding fra arbeidsgiveren din').and('is.visible')

        cy.contains(
            'Vi har dessverre ikke mottatt inntektsmelding fra arbeidsgiveren din, vi trenger denne for å behandle søknaden din om sykepenger. ',
        )
        cy.contains(
            'Uten inntektsmelding kan vi ikke behandle søknaden din om sykepenger, og du kan ikke få utbetalt sykepenger.',
        )
    })

    it('Mottatt inntektsmelding varsel kan lukkes', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mottatt-inntektsmelding')

        cy.get('[data-cy="oppgaver"]')
            .get(' .navds-alert')
            .should('have.length', 1)
            .contains(
                ' Vi har mottatt inntektsmeldingen fra Posten Norge AS for sykefraværet som startet 15. mars 2022.',
            )

        cy.get('[data-cy="oppgaver"]').find('.navds-alert .navds-button').click()

        cy.get('[data-cy="oppgaver"]').should('not.exist')
    })
})
