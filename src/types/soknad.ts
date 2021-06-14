import { RSArbeidssituasjon } from './rs-types/rs-arbeidssituasjon'
import { RSSoknad } from './rs-types/rs-soknad'
import { RSSoknadstatus } from './rs-types/rs-soknadstatus'
import { RSSoknadstype } from './rs-types/rs-soknadstype'


export class Soknad {
    id: string;
    soknadstype: RSSoknadstype;
    status: RSSoknadstatus;
    arbeidssituasjon: RSArbeidssituasjon | null;


    constructor(
        soknad: RSSoknad
    ) {
        this.id = soknad.id
        const type = soknad.soknadstype as keyof typeof RSSoknadstype
        this.soknadstype = RSSoknadstype[ type ]
        const stat = soknad.status as keyof typeof RSSoknadstatus
        this.status = RSSoknadstatus[ stat ]
        this.arbeidssituasjon = soknad.arbeidssituasjon as any

    }
}
