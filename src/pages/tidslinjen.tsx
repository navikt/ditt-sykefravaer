import { GetServerSideProps } from 'next'
import React from 'react'

import { Redirect } from '../components/redirect/redirect'

export const Tidslinjen = () => {
    // Redirecter til åpne sider for å
    return <Redirect addresse={'https://www.nav.no/sykepenger'} />
}

export const getServerSideProps: GetServerSideProps = async () => {
    // Disable static rendring
    return {
        props: {},
    }
}

export default Tidslinjen
