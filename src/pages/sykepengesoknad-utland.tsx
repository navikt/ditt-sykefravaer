import { GetServerSideProps } from 'next'
import React from 'react'

import { Redirect } from '../components/redirect/redirect'
import { sykepengesoknadUrl } from '../utils/environment'

const RedirectSykepengesoknadUtland = () => {
    return <Redirect addresse={`${sykepengesoknadUrl()}/sykepengesoknad-utland`} />
}

export const getServerSideProps: GetServerSideProps = async () => {
    // Disable static rendring
    return {
        props: {},
    }
}

export default RedirectSykepengesoknadUtland
