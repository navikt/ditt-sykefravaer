describe('Tester aktivitetskrav', () => {
    it('Har aktivitetskrav varsel', () => {
        cy.visit(
            'http://localhost:8080/syk/sykefravaer?testperson=aktivitetskrav-varsel'
        )

        cy.get('.oppgaver .navds-alert__wrapper .navds-link')
            .should('have.length', 3)
            .contains('Bekreft at du kjenner aktivitetsplikten')
            .click()

        cy.url().should(
            'contain',
            'http://localhost:8080/syk/sykefravaer/aktivitetsplikt'
        )

        cy.get('.artikkel')
            .should(
                'contain',
                'Du har snart vært sykmeldt i åtte uker. NAV skal vurdere om du oppfyller aktivitetsplikten og om du fortsatt har rett til sykepenger.'
            )
            .should(
                'contain',
                'Det er viktig at du har god dialog med arbeidsgiveren din om hva som skal til for at du kan være noe i arbeid. Hvis dere ikke har hatt dialog, ta kontakt og be om en samtale.'
            )
    })

    it('Bekrefter aktivitetskrav', () => {
        cy.get('.navds-button--primary').contains('BEKREFT').click()

        cy.get('.typo-feilmelding').contains(
            'Du må bekrefte at du har lest all informasjonen du har fått.'
        )

        cy.get('.navds-checkbox__label[for=bekreftAktivitetskrav]')
            .contains('Jeg har lest om aktivitetsplikten')
            .click()

        cy.get('.navds-button--primary').click()
    })

    it('Aktivitetskrav bekreftet kvittering', () => {
        cy.isInViewport('.navds-alert--success').contains(
            'Du har bekreftet at du har lest om aktivitetsplikten'
        )

        cy.get('.navds-button--primary').should('not.exist')
    })

    it('Aktivitetskrav bekreftet viser alltid bekreftelse av nyeste', () => {
        cy.visit(
            'http://localhost:8080/syk/sykefravaer/aktivitetsplikt?testperson=aktivitetskrav-bekreftet'
        )

        cy.get('.navds-alert--success').contains(
            'Du har bekreftet at du har lest om aktivitetsplikten 05.03.2021.'
        )
    })

    it('Ingen aktivitetskrav', () => {
        cy.visit(
            'http://localhost:8080/syk/sykefravaer/aktivitetsplikt?testperson=helt-frisk'
        )

        cy.get('.navds-alert--warning').contains(
            'Du har ingen varsel om aktivitetsplikt'
        )
    })
})

export {}
