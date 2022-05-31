import { GetServerSideProps } from 'next'
import React from 'react'

import { Redirect } from '../components/redirect/redirect'
import { sykmeldingUrl } from '../utils/environment'

export const RedirectSykmeldinger = () => {
    return <Redirect addresse={`${sykmeldingUrl()}`} />
}

export const getServerSideProps: GetServerSideProps = async () => {
    // Disable static rendring
    return {
        props: {},
    }
}

export default RedirectSykmeldinger
