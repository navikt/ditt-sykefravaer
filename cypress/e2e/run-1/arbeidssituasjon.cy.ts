describe('Tester arbeidssituasjon', () => {
    it('Bruker med flere arbeidsgivere', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=default')

        cy.get('[data-cy="din-situasjon"]')
            .children()
            .eq(1)
            .should('contain', 'Hogwarts School of Witchcraft and Wizardry')
            .click()

        cy.get('[data-cy="arbeidsgiver-accordion"]')
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('[data-cy="arbeidsgiver-accordion"]').should(
            'not.contain',
            'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
        )

        cy.get('[data-cy="din-situasjon"]').children().eq(2).should('contain', 'Diagon Alley').click()

        cy.get('[data-cy="arbeidsgiver-accordion"]')
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Severus Snape skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.navds-modal').should('not.exist')

        cy.get('[data-cy="arbeidsgiver-accordion"]').should(
            'not.contain',
            'Arbeidsgiveren har meldt inn at Severus Snape skal følge deg opp mens du er syk.',
        )
    })

    it('Avkreft nærmeste leder feiler', () => {
        cy.get('[data-cy="din-situasjon"]').children().eq(3).should('contain', 'Gloucester Cathedral').click()

        cy.get('[data-cy="arbeidsgiver-accordion"]')
            .should('contain', 'Arbeidsgiveren har meldt inn at Charity Burbage skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()
        cy.get('.navds-modal').contains('Beklager, det oppstod en feil!')
        cy.get('.navds-modal').should('be.visible')

        cy.get('.navds-modal').contains('Avbryt').click()
        cy.get('.navds-modal').should('not.exist')
        cy.get('[data-cy="din-situasjon"]').children().eq(3).should('contain', 'Gloucester Cathedral')
        cy.get('.navds-modal').should('not.exist')
    })

    it('Har narmesteleder og kan avkrefte den', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')

        cy.get('[data-cy="situasjon-innhold"]')
            .should('contain', 'Sykmeldingsperioder AS')
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.')

        cy.get('.navds-accordion__item')
            .should('contain', 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt')
            .click()

        cy.get('[data-cy="situasjon-innhold"]').contains('Meld fra om endring').click()

        cy.get('.navds-accordion__content')
            .should(
                'contain',
                'Arbeidsgiveren skal legge til rette for at du kan jobbe helt eller delvis selvom du er syk.',
            )
            .should('contain', 'Er det oppgaver jeg kan gjøre selv om jeg er syk?')
            .should('contain', 'Kan noe endres på arbeidsplassen for at jeg kan få det til?')

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.navds-modal').should('not.exist')

        cy.get('[data-cy="situasjon-innhold"]')
            .should('contain', 'Sykmeldingsperioder AS')
            .should(
                'not.contain',
                'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
            )
            .should('contain', 'Betaler lønn også etter de 16 første dagene i sykefraværet.')

        cy.get('.navds-accordion__item')
            .should('contain', 'Slik skal arbeidsgiver hjelpe deg mens du er sykmeldt')
            .click()
    })

    it('Arbeidsgiver forskutterer ikke', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=arbeidsgiver-forskutterer-ikke')

        cy.get('[data-cy="situasjon-innhold"]')
            .should('contain', 'Sykmeldingsperioder AS')
            .should('contain', 'Arbeidsgiveren din betaler ikke lønn etter de første 16 dagene.')
            .should('contain', 'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.')
            .contains('Meld fra om endring')
            .click()

        cy.get('.navds-modal').should('contain', 'Endre nærmeste leder').contains('Ja, jeg er sikker').click()

        cy.get('.navds-modal').should('not.exist')

        cy.get('[data-cy="situasjon-innhold"]')
            .should('contain', 'Sykmeldingsperioder AS')
            .should('contain', 'Arbeidsgiveren din betaler ikke lønn etter de første 16 dagene.')
            .should(
                'not.contain',
                'Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.',
            )
    })
})

export {}
