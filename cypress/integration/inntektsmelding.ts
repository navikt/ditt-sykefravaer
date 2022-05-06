describe('Tester inntektsmelding', () => {
    it('Har inntektsmelding varsel og riktig innhold', () => {
        cy.visit(
            'http://localhost:8080/syk/sykefravaer?testperson=aktivitetskrav-varsel'
        )

        cy.get('.oppgaver > .navds-alert')
            .should('have.length', 3)
            .contains('Vi mangler inntektsmeldingen fra Test Arbeidsgiver AS')
            .click()

        cy.url().should(
            'contain',
            'http://localhost:8080/syk/sykefravaer/inntektsmelding'
        )

        cy.get('.forklaring-bodylong')
            .should(
                'contain',
                'Arbeidsgiveren din har fått beskjed om å sende inntektsmelding, men vi kan ikke se å ha mottatt den enda.'
            )
            .should(
                'contain',
                'Søknaden din om sykepenger kan ikke behandles før vi har mottatt inntektsmeldingen. Derfor anbefaler vi at du kontakter arbeidsgiveren og gir beskjed om at de må sende oss inntektsmeldingen så snart som mulig.'
            )
    })
})

export {}
