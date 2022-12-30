describe('Tester arbeidssituasjon', () => {
    it('Bruker med flere arbeidsgivere', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=default')
        cy.injectAxe()

        cy.get('.din-situasjon > :nth-child(2)').should('contain', 'Hogwarts School of Witchcraft and Wizardry').click()
        cy.checkA11y('main')

        cy.get('.arbeidsgiver-accordion')
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()
        cy.checkA11y('main')

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.arbeidsgiver-accordion').should(
            'not.contain',
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )
        cy.checkA11y('main')

        cy.get('.din-situasjon > :nth-child(3)').should('contain', 'Diagon Alley').click()
        cy.checkA11y('main')

        cy.get('.arbeidsgiver-accordion')
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Severus Snape skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()
        cy.checkA11y('main')

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.arbeidsgiver-accordion').should(
            'not.contain',
            'Arbeidsgiveren har meldt inn at Severus Snape skal følge deg opp mens du er syk.',
        )
        cy.checkA11y('main')
    })

    it('Avkreft nærmeste leder feiler', () => {
        cy.get('.din-situasjon > :nth-child(4)').should('contain', 'Gloucester Cathedral').click()
        cy.checkA11y('main')

        cy.get('.arbeidsgiver-accordion')
            .should('contain', 'Arbeidsgiveren har meldt inn at Charity Burbage skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()
        cy.checkA11y('main')

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()
        cy.get('.navds-modal').contains('Beklager, det oppstod en feil!')
        cy.get('.navds-modal').should('be.visible')

        cy.checkA11y('main')
    })

    it('Har narmesteleder og kan avkrefte den', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')
        cy.injectAxe()

        cy.get('.situasjon__innhold')
            .should('contain', 'Sykmeldingsperioder AS')
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.')
        cy.checkA11y('main')

        cy.get('.navds-accordion__item')
            .should('contain', 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt')
            .click()
        cy.checkA11y('main')

        cy.get('.situasjon__innhold').contains('Meld fra om endring').click()
        cy.checkA11y('main')

        cy.get('.navds-accordion__content')
            .should(
                'contain',
                'Arbeidsgiveren skal legge til rette for at du kan jobbe helt eller delvis selvom du er syk.',
            )
            .should('contain', 'Er det oppgaver jeg kan gjøre selv om jeg er syk?')
            .should('contain', 'Kan noe endres på arbeidsplassen for at jeg kan få det til?')
        cy.checkA11y('main')

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.situasjon__innhold')
            .should('contain', 'Sykmeldingsperioder AS')
            .should(
                'not.contain',
                'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
            )
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')
        cy.checkA11y('main')

        cy.get('.navds-accordion__item')
            .should('contain', 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt')
            .click()
        cy.checkA11y('main')
    })

    it('Arbeidsgiver forskutterer ikke', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=arbeidsgiver-forskutterer-ikke')
        cy.injectAxe()

        cy.get('.situasjon__innhold')
            .should('contain', 'Sykmeldingsperioder AS')
            .should('contain', 'Arbeidsgiveren din betaler ikke lønn etter de første 16 dagene.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()
        cy.checkA11y('main')

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.situasjon__innhold')
            .should('contain', 'Sykmeldingsperioder AS')
            .should('contain', 'Arbeidsgiveren din betaler ikke lønn etter de første 16 dagene.')
            .should(
                'not.contain',
                'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
            )

        cy.checkA11y('main')
    })
})

export {}
