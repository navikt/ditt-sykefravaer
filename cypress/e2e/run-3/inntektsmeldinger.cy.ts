describe('Inntektsmeldinger', () => {
    before(() => {
        cy.visit('http://localhost:8080/syk/sykefravaer')
    })

    it('Går til listevisning av inntektsmeldinger', () => {
        cy.get('body')
            .findByRole('link', { name: /inntektsmeldinger/i })
            .click()
        cy.contains('Inntektsmeldinger')
    })

    it('Åpner inntektsmelding', () => {
        cy.contains('Inntektsmeldinger')
        cy.get('body')
            .findByRole('link', { name: /grefsen/i })
            .click()

        cy.contains('Bestemmende fraværsdag')
        cy.contains('Matbutikken AS, Grefsen')
    })

    it('Går til listevisning uten inntektsmeldinger', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer/inntektsmeldinger?testperson=helt-frisk')
        cy.contains('Du har ingen inntektsmeldinger som kan vises.')
    })

    it('Går til ikke eksisterende inntektsmelding', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer/inntektsmeldinger/213456?testperson=helt-frisk')
        cy.contains('Fant ikke inntektsmelding')
    })
})
