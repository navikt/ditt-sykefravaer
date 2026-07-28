import { ReactElement } from 'react'
import { BodyShort, List, ReadMore, Box } from '@navikt/ds-react';

export function ArbeidssituasjonInfo(): ReactElement {
    return (
        <>
            <BodyShort className="mt-4 -mb-4">Velg det som passer for denne sykmeldingen.</BodyShort>
            <ReadMore header="Spørsmålet forklart" className="mt-4 -mb-4">
                <BodyShort spacing>
                    Arbeidssituasjonen din avgjør hvilken søknad om sykepenger du får, hvem som betaler sykepengene
                    dine, og hvilke rettigheter du har.
                </BodyShort>
                <BodyShort>For eksempel:</BodyShort>
                <Box marginBlock="space-16" asChild><List data-aksel-migrated-v8>
                        <List.Item>Er du ansatt, betaler arbeidsgiveren de første 16 dagene.</List.Item>
                        <List.Item>Er du frilanser eller selvstendig næringsdrivende, overtar Nav fra dag 17.</List.Item>
                        <List.Item>Er du arbeidsledig med dagpenger, betaler Nav fra første dag.</List.Item>
                    </List></Box>
            </ReadMore>
        </>
    );
}
