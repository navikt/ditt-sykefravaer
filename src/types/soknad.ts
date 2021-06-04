import { dayjsToDate } from '../utils/dato-utils'
import { RSArbeidssituasjon } from './rs-types/rs-arbeidssituasjon'
import { RSSoknad } from './rs-types/rs-soknad'
import { RSSoknadstatus } from './rs-types/rs-soknadstatus'
import { RSSoknadstype } from './rs-types/rs-soknadstype'


export class Soknad {
    id: string;
    sykmeldingId: string;
    soknadstype: RSSoknadstype;
    status: RSSoknadstatus;
    arbeidssituasjon: RSArbeidssituasjon | null;
    fom?: Date;
    tom?: Date;
    avbruttDato?: Date;


    constructor(
        soknad: RSSoknad
    ) {
        this.id = soknad.id
        this.sykmeldingId = soknad.sykmeldingId!
        const type = soknad.soknadstype as keyof typeof RSSoknadstype
        this.soknadstype = RSSoknadstype[ type ]
        const stat = soknad.status as keyof typeof RSSoknadstatus
        this.status = RSSoknadstatus[ stat ]
        this.fom = dayjsToDate(soknad.fom!)!
        this.tom = dayjsToDate(soknad.tom!)!
        this.arbeidssituasjon = soknad.arbeidssituasjon as any

    }
}
