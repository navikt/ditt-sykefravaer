describe('Tester narmesteledere', () => {
    it('Har narmesteleder og kan avkrefte den', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')
        cy.injectAxe()
        cy.checkA11y()

        cy.get('.navds-panel .situasjon__panel')
            .should('contain', 'Ansatt i Sykmeldingsperioder AS')
            .should('contain', 'Din nærmeste leder er Albus Dumbledore')
            .should(
                'contain',
                'Arbeidsgiveren din betaler lønn også etter de 16 første dagene i sykefraværet. Dette har arbeidsgiver meldt inn til oss i Altinn.'
            )
        cy.checkA11y()

        cy.get('.navds-accordion__item')
            .should('contain', 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt')
            .click()
        cy.checkA11y()

        cy.get('.navds-accordion__content')
            .should(
                'contain',
                'Arbeidsgiveren skal legge til rette for at du kan jobbe helt eller delvis selvom du er syk.'
            )
            .should('contain', 'Er det noen arbeidsoppgaver jeg kan gjøre selv om jeg er syk?')
            .should('contain', 'Er det noe som kan gjøres for at jeg kan få det til?')
        cy.checkA11y()

        cy.get('.navds-panel .situasjon__panel').contains('Meld fra om endring').click()
        cy.checkA11y()

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.navds-panel .situasjon__panel')
            .should('contain', 'Ansatt i Sykmeldingsperioder AS')
            .should('not.contain', 'Din nærmeste leder er Albus Dumbledore')
            .should(
                'contain',
                'Vi har varslet bedriften din om at de må sende oss opplysninger om din nærmeste leder på nytt.'
            )
            .should(
                'contain',
                'Arbeidsgiveren din betaler lønn også etter de 16 første dagene i sykefraværet. Dette har arbeidsgiver meldt inn til oss i Altinn.'
            )
        cy.checkA11y()

        cy.get('.navds-accordion__item')
            .should('contain', 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt')
            .click()
        cy.checkA11y()

        cy.get('.navds-panel .situasjon__panel')
            .should('contain', 'Ansatt i Sykmeldingsperioder AS')
            .should('not.contain', 'Din nærmeste leder')
        cy.checkA11y()
    })

    it('Arbeidsgiver forskuterer ikke', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=arbeidsgiver-forskuterer-ikke')
        cy.injectAxe()
        cy.checkA11y()

        cy.get('.navds-panel .situasjon__panel')
            .should('contain', 'Ansatt i Sykmeldingsperioder AS')
            .should('contain', 'Din nærmeste leder er Albus Dumbledore')
            .should('contain', 'Arbeidsgiveren din betaler ikke lønn etter de første 16 dagene.')
            .contains('Meld fra om endring')
            .click()
        cy.checkA11y()
    })
})

export {}
