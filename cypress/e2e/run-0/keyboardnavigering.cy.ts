describe('Keyboard navigering', () => {
    it('Vi navigerer forsiden med mange elementer', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer')
        cy.contains('Du har en ny søknad om sykepenger').should('be.visible')
        cy.get('#maincontent').focus() //Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        cy.realPress('Tab')
        cy.realPress('Tab')

        // Første lenke er fokusert med riktig styling
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused().should('have.text', 'Du har en ny søknad om sykepenger')

        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused()
            .should('have.css', 'color', 'rgb(255, 255, 255)')
            .should('have.css', 'background-color', 'rgb(0, 52, 125)')


        cy.realPress('Tab')
        // Stylingen er ikke fokusert igjen
        cy.contains('Du har en ny søknad om sykepenger')
            .should('have.css', 'color', 'rgb(35, 38, 42)')
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')

        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused().should(
            'have.text',
            'Arbeidsgiveren din har begynt på en oppfølgingsplan. Du skal fylle ut din del.',
        )
        cy.realPress('Tab')
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused().should('have.text', 'Du har en oppfølgingsplan som venter på godkjenning av deg')

        cy.realPress('Tab')
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused().should('have.css', 'box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused().children().eq(1).should('have.text', 'Hogwarts School of Witchcraft and Wizardry')
        cy.realPress('Space')
        cy.contains('Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.').should(
            'be.visible',
        )
        cy.realPress('Enter')
        cy.contains('Arbeidsgiveren har meldt inn at Albus Dumbledore skal følge deg opp mens du er syk.').should(
            'not.be.visible',
        )

        cy.realPress('Tab')
        cy.realPress('Tab')
        cy.realPress('Tab')
        cy.realPress('Tab')
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused().should('include.text', 'Sykmeldinger')
        cy.realPress('Tab')

        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused()
            .should('include.text', 'Søknader')
            .should('have.css', 'box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')
    })

    it('Vi navigerer forsiden med lenke til mangelnde inntektsmelding', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mangler-inntektsmelding')
        cy.contains(
            'Vi venter på inntektsmeldingen fra Matbutikken AS for sykefraværet som startet 1. juni 2022.',
        ).should('be.visible')
        cy.get('#maincontent').focus() //Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        cy.realPress('Tab')
        cy.realPress('Tab')

        // Første lenke er fokusert med riktig styling
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.focused()
            .should(
                'have.text',
                'Vi venter på inntektsmeldingen fra Matbutikken AS for sykefraværet som startet 1. juni 2022.',
            )
            .should('have.css', 'color', 'rgb(255, 255, 255)')
            .should('have.css', 'background-color', 'rgb(0, 52, 125)')

        cy.realPress('Enter')
        cy.url().should('contain', 'http://localhost:8080/syk/sykefravaer/inntektsmelding')

        cy.contains('Vi har varslet arbeidsgiveren din om dette').should('be.visible')
    })
})
