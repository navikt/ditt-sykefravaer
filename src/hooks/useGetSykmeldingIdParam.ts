import { useRouter } from 'next/router'

function useGetSykmeldingIdParam(): string {
    const router = useRouter()

    const sykmeldingId = router.query.sykmeldingId

    if (typeof sykmeldingId !== 'string' || !/^[a-zA-Z0-9-]+$/.test(sykmeldingId)) {
        throw new Error(`Illegal param: ${sykmeldingId}`)
    }

    return sykmeldingId
}

export default useGetSykmeldingIdParam
