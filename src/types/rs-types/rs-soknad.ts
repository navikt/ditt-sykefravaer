import { RSArbeidssituasjonType } from './rs-arbeidssituasjon'
import { RSSoknadstatusType } from './rs-soknadstatus'
import { RSSoknadstypeType } from './rs-soknadstype'

export interface RSSoknad {
    id: string;
    sykmeldingId: string | null;
    soknadstype: RSSoknadstypeType;
    status: RSSoknadstatusType;
    arbeidssituasjon: RSArbeidssituasjonType | null;
    fom: string | null;
    tom: string | null;
}


