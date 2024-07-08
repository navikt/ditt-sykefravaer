import dayjs from 'dayjs'

import { tilLesbarDatoMedArstall } from '../../../src/utils/dato-utils'

describe('Maksdato', () => {
    before(() => {
        cy.visit('http://localhost:8080/syk/sykefravaer?testperson=syk-naa-med-maksdato')
    })

    it('Finner maksdato kortet og kan åpne den', () => {
        const sisteUtbetaling = tilLesbarDatoMedArstall(dayjs().subtract(1, 'day').toDate())
        const maksdato = tilLesbarDatoMedArstall(dayjs().add(340, 'days').toDate())
        const forventetTekst = `Maksdato per ${sisteUtbetaling} er ${maksdato}`
        cy.findByRole('region', {
            name: 'Beregnet slutt på sykepenger',
        }).click()
        cy.get('.navds-expansioncard__header').should('contain', forventetTekst)
    })

    it('Innholdet i maksdato kortet er riktig', () => {
        cy.get('.navds-expansioncard__content')
            .should(
                'contain',
                'Du kan maksimalt få sykepenger fra NAV i 52 uker. Grensen er den samme enten du er helt eller delvis sykmeldt og kalles også maksdato. Datoen gjelder hvis du er sammenhengende sykmeldt. Den vil flytte seg hvis du for eksempel ikke får sykepenger fra NAV i perioder, eller hvis du tar ferie.',
            )
            .should(
                'contain',
                'Sykefravær inntil 3 år tilbake i tid blir lagt sammen hvis det er mindre enn 26 uker mellom noen av fraværene.',
            )
            .should(
                'contain',
                'Hvis du har brukt opp de 52 ukene, må det gå 26 uker uten sykepenger eller Arbeidsavklaringspenger (AAP) før du kan få sykepenger igjen, du kan lese mer om dette i folketrygdloven § 8-12. Blir du syk på nytt før disse ukene har gått, kan det være aktuelt med AAP som erstatning for sykepenger. Ta gjerne kontakt med NAV eller snakk med veilederen din om dette.',
            )
            .should(
                'contain',
                'Hvis du har fått sykepenger i 52 uker og fortsatt ikke kan arbeide på grunn av sykdom eller skade, kan du ha rett til arbeidsavklaringspenger eller uføretrygd.',
            )

        cy.contains('folketrygdloven § 8-12.').should(
            'have.attr',
            'href',
            'https://lovdata.no/nav/folketrygdloven/kap8/%C2%A78-12',
        )
        cy.contains('Det er egne regler for deg som er mellom 67 og 70 år.').should(
            'have.attr',
            'href',
            'https://www.nav.no/sykepenger#hvor-lenge',
        )
        cy.contains('Les mer om mulighetene dine etter det er slutt på sykepengene.').should(
            'have.attr',
            'href',
            'https://www.nav.no/sykepenger#hvor-lenge',
        )
    })
})
