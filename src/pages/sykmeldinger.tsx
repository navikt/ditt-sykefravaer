import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { sykmeldingUrl } from '../utils/environment'
import { getFlagsServerSide } from '../toggles/ssr'
import { ServerSidePropsResult } from '../auth/beskyttetSide'

// This component should never render since we always redirect
export const RedirectSykmeldinger = () => {
    return null
}

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ServerSidePropsResult>> => {
    const flags = await getFlagsServerSide(context)
    const gradualRolloutToggle = flags.toggles.find(
        (toggle) => toggle.name === 'ditt-sykefravaer-sykmelding-gradvis-utrulling',
    )

    if (gradualRolloutToggle?.enabled) {
        return {
            redirect: {
                destination: '/sykmelding',
                permanent: false,
            },
        }
    } else {
        return {
            redirect: {
                destination: sykmeldingUrl(),
                permanent: false,
            },
        }
    }
}

export default RedirectSykmeldinger
