describe('Tester tidslinjen', () => {

    it('Lenk til tidslinjen ligger i tidslinjeutdrag', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer/?testperson=langtidssykmeldt')

        cy.get('.tidslinjeutdrag__container .lesMerPanel__toggle')
            .contains('Les mer')
            .click()

        cy.get('.lenke--tilTidslinje')
            .click()

        cy.url().should('contain', 'http://localhost:8080/syk/sykefravaer/tidslinjen')
    })

    it('Jeg har arbeidsgiver', () => {
        cy.get('.tidslinjeHendelse__rad')
            .should('contain', 'Første sykmeldingsdag 6. januar 2021')
            .should('contain', 'Når du er blitt syk')
            .should('contain', 'Snakk med arbeidsgiveren din')
            .should('contain', '4 uker')
            .should('contain', 'Tid for dialogmøte med lederen din')
            .should('contain', 'Oppfyller du aktivitetsplikten?')
            .should('contain', '17 uker')
            .should('contain', 'Tid for dialogmøte med NAV')
            .should('contain', '26 uker')
            .should('contain', 'Når du har vært sykmeldt lenge')
            .should('contain', 'Snart slutt på sykepengene')

        cy.get('.tidslinjeHendelse__rad')
            .should('contain', '23. juli 2021')
            .contains('Sykmeldingsperioder AS har oppgitt Albus Dumbledore som din nærmeste leder med personalansvar.')
            .click()

        cy.contains('Koblingen mellom deg og Albus Dumbledore er aktiv')
    })

    it('Jeg har ikke arbeidsgiver', () => {
        cy.contains('Jeg har ikke arbeidsgiver')
            .click()

        cy.get('.tidslinjeHendelse__rad')
            .should('contain', 'Første sykmeldingsdag 6. januar 2021')
            .should('contain', 'Når du er blitt syk')
            .should('contain', 'Har du vurdert din mulighet for å være i aktivitet?')
            .should('contain', '8 uker')
            .should('contain', 'Har du snakket med en veileder på NAV-kontoret?')
            .should('contain', '12 uker')
            .should('contain', 'Har du og veilederen laget en plan?')
            .should('contain', '39 uker')
            .should('contain', 'Snart slutt på sykepengene')

        cy.get('.tidslinjeHendelse__rad')
            .contains('Sykmeldingsperioder AS har oppgitt Albus Dumbledore som din nærmeste leder med personalansvar.')
            .should('not.exist')
    })
})
