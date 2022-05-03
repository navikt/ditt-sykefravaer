import { Brev, BrevType } from '../../../types/brev'

const documenter = [
    {
        type: 'PARAGRAPH',
        title: 'Møtetidspunkt',
        texts: ['20. mai 2025, Storgata 4'],
    },
    {
        type: 'PARAGRAPH',
        title: 'Møtested',
        texts: ['Videomøte på Teams'],
    },
    {
        type: 'LINK',
        title: 'Lenke til videomøte',
        texts: ['https://teams.microsoft.com/l/osv.osv.osv'],
    },
    {
        type: 'PARAGRAPH',
        texts: [
            'Velkommen til dialogmøte mellom deg, arbeidsgiveren din og en veileder fra NAV. I møtet skal vi snakke om situasjonen din og bli enige om en plan som kan hjelpe deg videre.',
        ],
    },
    {
        type: 'PARAGRAPH',
        texts: [
            'Hvis vårt forslag til møtetidspunkt, møtested eller møteform ikke passer, ber vi om at du tar kontakt for å diskutere alternativer. I så fall kan du sende epost eller ringe undertegnede på telefon. Vi minner om at det ikke må sendes sensitive personopplysninger over e-post eller SMS.',
        ],
    },
    {
        type: 'PARAGRAPH',
        texts: [
            'Etter reglene kan NAV be sykmelder eller annet helsepersonell om å delta i møtet. Til dette møtet har vi ikke sett behov for det.',
        ],
    },
    {
        type: 'PARAGRAPH',
        title: 'Før møtet',
        texts: [
            'Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV. Det gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.',
        ],
    },
    {
        type: 'PARAGRAPH',
        texts: [
            'Med hilsen',
            'NAV Staden',
            'Kari Saksbehandler',
            'kari@nav.no',
            '99998888',
        ],
    },
]

const innkallelse: Brev = {
    uuid: 'mock-uuid',
    deltakerUuid: 'mock-deltaker-uuid',
    createdAt: '2019-11-08T12:35:37.669+01:00',
    brevType: BrevType.INNKALT,
    digitalt: true,
    lestDato: null,
    fritekst: 'Fri tekst',
    sted: 'Videomøte på Teams',
    tid: '2025-11-08T12:35:37.669+01:00',
    videoLink: 'https://teams.microsoft.com/l/osv.osv.osv',
    document: documenter,
    virksomhetsnummer: '1234',
}

export const brev: Brev[] = [innkallelse]
