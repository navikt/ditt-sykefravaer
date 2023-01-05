describe('Keyboard navigering', () => {
    it('Vi navigerer forsiden med mange elementer', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer')
        cy.get('#maincontent').should('be.visible')
        cy.get('#maincontent').focus() //Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        cy.realPress('Tab')
        cy.realPress('Tab')

        // Første lenke er fokusert med riktig styling
        cy.focused()
            .should('have.text', 'Du har en ny søknad om sykepenger')
            .should('have.css', 'color', 'rgb(255, 255, 255)')
            .should('have.css', 'background-color', 'rgb(0, 52, 125)')

        cy.realPress('Tab')
        // Stylingen er ikke fokusert igjen
        cy.contains('Du har en ny søknad om sykepenger')
            .should('have.css', 'color', 'rgb(38, 38, 38)')
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')

        cy.focused().should(
            'have.text',
            'Arbeidsgiveren din har begynt på en oppfølgingsplan. Du skal fylle ut din del.',
        )
        cy.realPress('Tab')
        cy.focused().should('have.text', 'Du har en oppfølgingsplan som venter på godkjenning av deg')
        cy.realPress('Tab')
        cy.focused().should('have.text', 'Du er innkalt til dialogmøte - vi trenger svaret ditt')

        cy.realPress('Tab')
        cy.focused().should('have.text', 'hjelphjelp')
        cy.realPress('Space')
        cy.contains('Arbeidssituasjonen er bestemt av hva du krysset av på i sykmeldingen').should('be.visible')
        cy.realPress('Enter')
        cy.contains('Arbeidssituasjonen er bestemt av hva du krysset av på i sykmeldingen').should('not.be.visible')

        cy.realPress('Tab')
        cy.focused()
            .should('have.text', 'Hogwarts School of Witchcraft and Wizardry')
            .should('have.css', 'box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')
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
        cy.focused().should('include.text', 'Sykmeldinger')
        cy.realPress('Tab')

        cy.focused()
            .should('include.text', 'Søknader')
            .should('have.css', 'box-shadow', 'rgb(0, 52, 125) 0px 0px 0px 3px')
    })

    it('Vi navigerer forsiden med lenke til mangelnde inntektsmelding', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=mangler-inntektsmelding')
        cy.get('#maincontent').should('be.visible')
        cy.get('#maincontent').focus() //Fokuserer på første element i maincontent på samme måte som skiplenke fra dekoratøren

        cy.realPress('Tab')
        cy.realPress('Tab')

        // Første lenke er fokusert med riktig styling
        cy.focused()
            .should(
                'have.text',
                'Vi mangler inntektsmeldingen fra Test Arbeidsgiver AS for sykefraværet som startet 1. juni 2022.',
            )
            .should('have.css', 'color', 'rgb(255, 255, 255)')
            .should('have.css', 'background-color', 'rgb(0, 52, 125)')

        cy.realPress('Enter')
        cy.url().should('contain', 'http://localhost:8080/syk/sykefravaer/inntektsmelding')

        cy.contains(
            'Vi har varslet jobben din om å sende inntektsmeldingen, men vi kan ikke se at vi har fått den ennå.',
        ).should('be.visible')

        cy.realPress('Tab')
        cy.realPress('Tab')

        // Første lenke er fokusert med riktig styling
        cy.focused().should('have.text', 'Til ditt sykefraværDitt sykefravær')
        cy.realPress('Enter')
        cy.url().should('equal', 'http://localhost:8080/syk/sykefravaer')
    })
})

export {}
