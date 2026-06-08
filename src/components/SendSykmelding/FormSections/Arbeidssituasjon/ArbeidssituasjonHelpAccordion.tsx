import React, { ReactElement } from 'react'
import { Accordion, BodyLong } from '@navikt/ds-react'

function ArbeidssituasjonHelpAccordion(): ReactElement {
    return (
        <Accordion size="small" className="mt-4 [&_.navds-accordion\_\_header-content]:!font-light">
            <Accordion.Item>
                <Accordion.Header>Finner du ikke riktig situasjon?</Accordion.Header>
                <Accordion.Content>
                    <BodyLong spacing>
                        Sykepengene skal dekke det du mister av lønn fordi du ikke kan jobbe. Med andre ord skal
                        sykepengene erstatte tapt arbeidsinntekt. Velg derfor situasjon etter hvordan du jobber (med
                        mindre du har blitt arbeidsledig).
                    </BodyLong>
                    <BodyLong>
                        <strong>Er du student?</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Er du sykmeldt fra jobb du har ved siden av studiene, skal du velge <strong>ansatt</strong>.
                    </BodyLong>
                    <BodyLong spacing>
                        Studerer du uten jobb, har du i utgangspunktet ikke rett til sykepenger fra Nav. Studielån og
                        stipend gir ikke rett til sykepenger.
                    </BodyLong>
                    <BodyLong>
                        <strong>Er du pensjonist?</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Jobber du ved siden av pensjonen? Velg situasjon etter hva slags type jobb det er (
                        <strong>ansatt</strong>, <strong>frilanser</strong> eller{' '}
                        <strong>selvstendig næringsdrivende</strong>).
                    </BodyLong>
                    <BodyLong spacing>Jobber du ikke, har du i utgangspunktet ikke rett på sykepenger.</BodyLong>
                    <BodyLong>
                        <strong>Er du vernepliktig?</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Blir du syk under tjenesten, kan du ha rett til sykepenger — men de starter tidligst dagen etter
                        at du er dimittert.
                    </BodyLong>
                    <BodyLong spacing>
                        Hadde du jobb før tjenesten og er tilbake i den, velger du <strong>ansatt</strong>. Er du
                        dimittert og ikke tilbake i jobb ennå, velger du <strong>arbeidsledig</strong>.
                    </BodyLong>
                    <BodyLong>
                        <strong>Er du vikar?</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Du har i utgangspunktet de samme rettighetene som fast ansatte. Velg derfor{' '}
                        <strong>ansatt</strong>.
                    </BodyLong>
                    <BodyLong>
                        <strong>Er du lærling?</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Du er ansatt hos lærebedriften, så velg <strong>ansatt</strong>.
                    </BodyLong>
                    <BodyLong>
                        <strong>Er du barnepasser?</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Med barnepasser (dagmamma) mener vi en som driver privat barnepassvirksomhet i eget hjem, men
                        ikke familiebarnehage.
                    </BodyLong>
                    <BodyLong spacing>
                        Er du barnepasser i <strong>barnets hjem</strong>, skal du velge <strong>ansatt</strong>.
                    </BodyLong>
                    <BodyLong spacing>
                        Er du barnepasser i <strong>eget hjem</strong>, velger du{' '}
                        <strong>selvstendig næringsdrivende</strong>.
                    </BodyLong>
                    <BodyLong>
                        <strong>Får du tiltakspenger?</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Mottar du tiltakspenger har du i utgangspunktet ikke rett til sykepenger fra Nav.
                    </BodyLong>
                    <BodyLong spacing>
                        Er du syk i mer enn 3 dager mens du er i et arbeidsmarkedstiltak, og trenger å levere sykmelding
                        velger du <strong>arbeidsledig</strong>.
                    </BodyLong>
                    <BodyLong>
                        Er du fortsatt usikker på hva du skal velge, kan du ringe oss på 55 55 33 33 så skal vi prøve å
                        hjelpe deg.
                    </BodyLong>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>Har du flere jobber?</Accordion.Header>
                <Accordion.Content>
                    <BodyLong spacing>Du trenger én sykmelding per jobb eller arbeidssituasjon du har.</BodyLong>
                    <BodyLong>
                        Denne sykmeldingen gjelder bare for én jobb. Be legen om egne sykmeldinger for hver
                        arbeidssituasjon du er sykmeldt fra.
                    </BodyLong>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>Hva er forskjellen på frilanser og selvstendig næringsdrivende?</Accordion.Header>
                <Accordion.Content>
                    <BodyLong spacing>
                        <strong>Frilanser:</strong> Du tar oppdrag og fakturerer, men har ikke registrert eget foretak.
                        Du har ikke ENK eller AS.
                    </BodyLong>
                    <BodyLong spacing>
                        <strong>Selvstendig næringsdrivende</strong>: Du har registrert enkeltpersonsforetak (ENK),
                        ansvarlig selskap (ANS) eller selskap med delt ansvar (DA)
                    </BodyLong>
                    <BodyLong>
                        <strong>Driver du AS?</strong> Da er du som oftest ansatt i ditt eget selskap og skal velge
                        ansatt — ikke selvstendig næringsdrivende.
                    </BodyLong>
                </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
                <Accordion.Header>Går du på arbeidsavklaringspenger (AAP) eller uføretrygd?</Accordion.Header>
                <Accordion.Content>
                    <BodyLong>
                        <strong>Arbeidsavklaringspenger (AAP)</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Mottar du AAP, fortsetter ytelsen som normalt. Du trenger normalt ikke sykepenger i tillegg, og
                        kan avbryte denne sykmeldingen uten at det påvirker AAP. Ønsker du fortsatt å søke om
                        sykepenger, velger du den arbeidssituasjonen som gjelder for deg.
                    </BodyLong>
                    <BodyLong spacing>
                        Går du på arbeidsavklaringspenger og <strong>jobber ved siden av</strong>? Da kan du ha rett til
                        sykepenger av arbeidsinntekten. Velg i så fall den situasjonen som passer best for jobben du har
                        ved siden av.
                    </BodyLong>
                    <BodyLong>
                        <strong>Uføretrygd</strong>
                    </BodyLong>
                    <BodyLong spacing>
                        Har du <strong>full uføretrygd</strong> har du i utgangspunktet ikke rett til sykepenger fra
                        Nav. Uføretrygden din fortsetter uansett, og du kan avbryte denne sykmeldingen uten at det
                        påvirker uføretrygden.
                    </BodyLong>
                    <BodyLong spacing>
                        Ønsker du fortsatt å søke om sykepenger, bekrefter du bare denne sykmeldingen og fyller ut
                        søknaden om sykepenger som vanlig.
                    </BodyLong>
                    <BodyLong>
                        Har du uføretrygd og <strong>jobber ved siden av</strong>? Da kan du ha rett til sykepenger av
                        arbeidsinntekten. Velg i så fall den situasjonen som passer best for jobben du har ved siden av.
                    </BodyLong>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )
}

export default ArbeidssituasjonHelpAccordion
