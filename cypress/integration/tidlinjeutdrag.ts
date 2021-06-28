describe('Tester tidslinjeutdrag', () => {

    it('Syk i 1 uke', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=en-ny-sykmelding')

        cy.get('input[type=radio][value=MED_ARBEIDSGIVER]').should('have.attr', 'checked')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Når du er blitt syk')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__innhold').within(() => {
            cy.contains('Du bestemmer selv om du vil bruke sykmeldingen eller avbryte den. Du kan også jobbe i kombinasjon med sykmelding. Det kommer an på hva sykdommen din tillater og hva det er praktisk mulig å få til på arbeidsplassen.')
            cy.contains('Greit å vite: Arbeidsgiveren har plikt til å legge til rette for at du kan jobbe helt eller delvis selv om du er syk.')
            cy.contains('Husk at du alltid kan vurdere gradert sykmelding.')
            cy.contains('Vet du at fraværet blir kort, kan det være like greit med egenmelding, så slipper du å gå til legen.')
            cy.contains('Les mer om sykmelding og sykepenger eller se filmen Hva skjer etter at jeg har sendt sykmeldingen?')
            cy.get('a').contains('gradert sykmelding')
                .should('have.attr', 'href', 'https://www.nav.no/no/person/arbeid/sykmeldt-arbeidsavklaringspenger-og-yrkesskade/sykmelding-ulike-former/gradertsykemelding')
            cy.get('a').contains('egenmelding')
                .should('have.attr', 'href', 'https://www.nav.no/no/person/arbeid/sykmeldt-arbeidsavklaringspenger-og-yrkesskade/sykmelding-ulike-former/egenmelding')
            cy.get('a').contains('sykmelding og sykepenger')
                .should('have.attr', 'href', 'https://www.nav.no/no/person/arbeid/sykmeldt-arbeidsavklaringspenger-og-yrkesskade/sykmeldt')
            cy.get('a').contains('Hva skjer etter at jeg har sendt sykmeldingen?')
                .should('have.attr', 'href', 'https://video.qbrick.com/play2/embed/player?accountId=763558&mediaId=B248D6CB&configId=default&pageStyling=adaptive&autoplay=false&repeat=false&sharing=false&download=true')
        })

        cy.get('.friskmelding__bjorn')
            .should('contain', 'Hei, et lite tips: Har det blitt lettere for deg å komme tilbake til jobb, kan du avbryte sykmeldingen før den er helt over.')
            .contains('Jeg vil vite mer')
            .click()
        cy.get('.modal')
            .should('contain', 'Trenger du ikke være sykmeldt lenger og vil tilbake til jobb?')
            .get('.lukknapp')
            .click()


        cy.get('input[type=radio][value=UTEN_ARBEIDSGIVER]').click({ force: true })
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Når du er blitt syk')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__innhold').within(() => {
            cy.contains('Du bestemmer selv om du vil bruke sykmeldingen. Du kan enten bekrefte den eller avbryte den.')
            cy.contains('I noen tilfeller kan det være godt å få jobbe selv om du er syk. Det kommer an på hva sykdommen din tillater og hva som er praktisk mulig å få til.')
            cy.contains('Ta gjerne kontakt med NAV-kontoret hvis du vil drøfte hvilke muligheter du har.')
            cy.contains('Husk at du alltid kan vurdere gradert sykmelding.')
            cy.contains('Les mer om sykmelding og sykepenger')
            cy.get('a').contains('gradert sykmelding')
                .should('have.attr', 'href', 'https://www.nav.no/no/person/arbeid/sykmeldt-arbeidsavklaringspenger-og-yrkesskade/sykmelding-ulike-former/gradertsykemelding')
            cy.get('a').contains('Les mer om sykmelding og sykepenger')
                .should('have.attr', 'href', 'https://www.nav.no/no/person/arbeid/sykmeldt-arbeidsavklaringspenger-og-yrkesskade/sykmeldt')
        })

        cy.get('.friskmelding__bjorn').should('not.exist')
    })

    it('Syk i 22 uker', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=langtidssykmeldt')

        cy.get('input[type=radio][value=MED_ARBEIDSGIVER]').should('have.attr', 'checked')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Når du har vært sykmeldt lenge')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__innhold').within(() => {
            cy.contains('Du har kanskje vært i dialogmøte med NAV? Da handler det om å følge opp det som ble avtalt i møtet. Planene avhenger av hva som er mulig ut fra helsesituasjonen din.')
            cy.contains('Arbeidsgiveren din har fortsatt et ansvar. Du kan be NAV om et nytt dialogmøte sammen med lederen din og eventuelt legen.')
            cy.get('a').contains('nytt dialogmøte')
                .should('have.attr', 'href', 'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/relatert-informasjon/slik-folger-du-opp-sykmeldte/dialogmote-2-og-3-nav_kap')
        })

        cy.get('input[type=radio][value=UTEN_ARBEIDSGIVER]').click({ force: true })
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Har du og veilederen laget en plan?')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__innhold').within(() => {
            cy.contains('Hvis du ikke allerede har vært på NAV-kontoret og laget en aktivitetsplan, kan du logge deg inn på nav.no og ta i bruk den digitale aktivitetsplanen.')
            cy.contains('Legg inn aktiviteter som du mener er nyttige for å komme i jobb. Du kan starte en dialog med veilederen når du er inne i planen. Veilederen kan også starte en dialog med deg.')
            cy.contains('Planen vil avhenge av hvilken aktivitet som er mulig ut fra helsesituasjonen din.')
            cy.contains('Les mer om aktivitetsplanen.')
            cy.get('a').contains('aktivitetsplanen')
                .should('have.attr', 'href', 'https://www.nav.no/no/person/arbeid/oppfolging-og-tiltak-for-a-komme-i-jobb/relatert-informasjon/din-aktivitetsplan')
        })
    })

    it('Syk i 42 uker', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=snart-slutt')

        cy.get('input[type=radio][value=MED_ARBEIDSGIVER]').should('have.attr', 'checked')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Snart slutt på sykepengene')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__innhold').within(() => {
            cy.contains('Det nærmer seg datoen da du ikke lenger kan få sykepenger. Sammen med arbeidsgiveren din eller en NAV-veileder kan du planlegge veien videre. Se hva du kan gjøre.')
            cy.contains('Blir du sykmeldt lenger enn 52 uker til sammen, har du ikke lenger rett til sykepenger. Du har ulike alternativer for å unngå å stå uten inntekt når sykepengene tar slutt. Se mer om hvordan du kan planlegge veien videre sammen med arbeidsgiveren din eller en NAV-veileder. Gå til alternativene.')
            cy.get('a').contains('Se hva du kan gjøre.')
                .should('have.attr', 'href', '/syk/sykefravaer/snart-slutt-pa-sykepengene')
            cy.get('a').contains('Gå til alternativene.')
                .should('have.attr', 'href', '/syk/sykefravaer/snart-slutt-pa-sykepengene')
        })

        cy.get('input[type=radio][value=UTEN_ARBEIDSGIVER]').click({ force: true })
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Snart slutt på sykepengene')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__innhold').within(() => {
            cy.contains('Det nærmer seg datoen da du ikke lenger kan få sykepenger. Sammen med en NAV-veileder kan du planlegge veien videre. Se hva du kan gjøre.')
            cy.contains('Blir du sykmeldt lenger enn 52 uker til sammen, har du ikke lenger rett til sykepenger. Du har ulike alternativer for å unngå å stå uten inntekt når sykepengene tar slutt. Se mer om hvordan du kan planlegge veien videre sammen med en NAV-veileder. Gå til alternativene.')
            cy.get('a').contains('Se hva du kan gjøre.')
                .should('have.attr', 'href', '/syk/sykefravaer/snart-slutt-pa-sykepengene')
            cy.get('a').contains('Gå til alternativene.')
                .should('have.attr', 'href', '/syk/sykefravaer/snart-slutt-pa-sykepengene')
        })
    })

    it('Syk i 42 uker, men tvinger mindre enn 39 uker', () => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=tving-mindre-enn-trettini-uker')

        cy.get('input[type=radio][value=MED_ARBEIDSGIVER]').should('have.attr', 'checked')
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Når du har vært sykmeldt lenge')

        cy.get('input[type=radio][value=UTEN_ARBEIDSGIVER]').click({ force: true })
        cy.get('.tidslinjeutdrag__container .ekspanderbartPanel__tittel')
            .contains('Har du og veilederen laget en plan?')
    })
})
