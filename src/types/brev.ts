export interface Brev {
    uuid: string;
    deltakerUuid: string;
    createdAt: string;
    brevType: BrevType;
    digitalt: boolean;
    lestDato?: string | null;
    fritekst: string;
    sted: string;
    tid: string;
    videoLink?: string;
    document: BrevDocument[];
    virksomhetsnummer: string;
}

type BrevDocument = {
    type: string;
    title?:string | null;
    texts: string[];
};

export enum BrevType {
    INNKALT= 'INNKALT',
    AVLYST= 'AVLYST',
    ENDRING='NYTT_TID_STED',
    REFERAT= 'REFERAT',
}
