import { ArbeidssituasjonType, LottOgHyre } from '../../../types/sykmelding/sykmeldingCommon'
import { StatusEvent } from '../../../types/sykmelding/sykmelding'
import { MuterbarSykmelding } from '../../../server/api-models/sykmelding/MuterbarSykmelding'
import { Brukerinformasjon } from '../../../server/api-models/Brukerinformasjon'
import { ErUtenforVentetid } from '../../../server/api-models/ErUtenforVentetid'
import { BrukerSvar } from '../../../server/api-models/sykmelding/SykmeldingStatus'
import { Arbeidsgiver } from '../../../server/api-models/Arbeidsgiver'
import { mapSendSykmeldingValuesToV3Api } from '../../../server/sendSykmeldingMapping'
import { TidligereArbeidsgivere } from '../../../server/api-models/TidligereArbeidsgiver'
import { SykmeldingChangeStatus } from '../../../hooks/useChangeSykmeldingStatus'
import { SendSykmeldingValues } from '../../../server/api-models/SendSykmeldingValues'

import { defaultArbeidsgivere } from './data-creators'

class MockDb {
    private readonly _sykmeldinger: MuterbarSykmelding[]
    private _antallArbeidsgivere = 1
    private _erUtenforVentetid = false
    private _oppfolgingsdato: string | null = '2021-04-10'

    constructor(scenario: { sykmeldinger: MuterbarSykmelding[] }) {
        this._sykmeldinger = scenario.sykmeldinger
    }

    sykmeldinger(): MuterbarSykmelding[] {
        return this._sykmeldinger
    }

    brukerinformasjon(): Brukerinformasjon {
        return {
            arbeidsgivere: this.arbeidsgivere(),
        }
    }

    sykeldingErUtenforVentetid(): ErUtenforVentetid {
        return {
            erUtenforVentetid: this._erUtenforVentetid,
            oppfolgingsdato: this._oppfolgingsdato,
        }
    }

    tidligereArbeidsgivere(): TidligereArbeidsgivere[] {
        return this.arbeidsgivere().map((ag) => {
            return {
                orgNavn: ag.navn,
                orgnummer: ag.orgnummer,
            }
        })
    }

    sykmelding(id: string): MuterbarSykmelding {
        const sykmelding = this._sykmeldinger.find((it) => it.id === id)
        if (!sykmelding) {
            throw new Error(`Unable to find sykmelding by sykmeldingId: ${id}`)
        }

        return sykmelding
    }

    changeSykmeldingStatus(id: string, status: SykmeldingChangeStatus): MuterbarSykmelding {
        const zodStatus =
            status === SykmeldingChangeStatus.AVBRYT
                ? StatusEvent.AVBRUTT
                : status === SykmeldingChangeStatus.BEKREFT_AVVIST
                  ? StatusEvent.BEKREFTET
                  : StatusEvent.APEN

        const sykmelding = this.sykmelding(id)
        sykmelding.sykmeldingStatus.statusEvent = zodStatus
        return sykmelding
    }

    sendSykmelding(id: string, values: SendSykmeldingValues): MuterbarSykmelding {
        const sykmelding = this.sykmelding(id)

        // Validate that real mapping would have worked
        const apiValues = mapSendSykmeldingValuesToV3Api(
            values,
            sykmelding,
            this.brukerinformasjon(),
            this.sykeldingErUtenforVentetid(),
        )

        // Simulate what would happen in sykmeldinger-backend Validation step
        if (apiValues.arbeidssituasjon.svar === ArbeidssituasjonType.FISKER && apiValues.fisker != null) {
            if (apiValues.fisker.lottOgHyre.svar === 'LOTT') {
                if (apiValues.harBruktEgenmelding == null) {
                    throw new Error('Valgt fisker uten å fylle ut fiskerfeltene')
                }
            } else {
                // HYRE eller BEGGE
                if (apiValues.arbeidsgiverOrgnummer == null) {
                    throw new Error('Valgt fisker uten å fylle ut arbeidsgiverOrgnummer')
                }
            }
        }
        if (
            values.arbeidssituasjon === ArbeidssituasjonType.ARBEIDSTAKER ||
            (values.arbeidssituasjon === ArbeidssituasjonType.FISKER &&
                (values.fisker?.lottOgHyre === LottOgHyre.HYRE || values.fisker?.lottOgHyre === LottOgHyre.BEGGE))
        ) {
            const selectedArbeidsgiver = this.arbeidsgivere().find(
                (it) => it.orgnummer === values.arbeidsgiverOrgnummer,
            )

            sykmelding.sykmeldingStatus.statusEvent = StatusEvent.SENDT
            sykmelding.sykmeldingStatus.arbeidsgiver = selectedArbeidsgiver
                ? {
                      orgnummer: selectedArbeidsgiver.orgnummer,
                      orgNavn: selectedArbeidsgiver.navn,
                  }
                : null
        } else {
            sykmelding.sykmeldingStatus.statusEvent = StatusEvent.BEKREFTET
        }

        sykmelding.sykmeldingStatus.brukerSvar = apiValues as unknown as BrukerSvar

        return sykmelding
    }

    setAntallArbeidsgivere(antall: number): void {
        this._antallArbeidsgivere = antall
    }

    setErUtenforVentetid(erUtenforVentetid: boolean): void {
        this._erUtenforVentetid = erUtenforVentetid
    }

    setOppfolgingsdato(oppfolgingsdato: string | ''): void {
        if (!oppfolgingsdato) {
            this._oppfolgingsdato = null
            return
        }

        this._oppfolgingsdato = oppfolgingsdato
    }

    private arbeidsgivere(): Arbeidsgiver[] {
        return defaultArbeidsgivere.slice(0, this._antallArbeidsgivere)
    }
}

export default MockDb
