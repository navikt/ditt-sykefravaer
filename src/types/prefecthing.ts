import { GetServerSidePropsResult } from 'next'
import { DehydratedState } from 'react-query/hydration'

export interface PrefetchResults {
    dehydratedState: DehydratedState;
    sykmeldtFnr: string | null
}

export type GetServerSidePropsPrefetchResult = GetServerSidePropsResult<PrefetchResults>;
