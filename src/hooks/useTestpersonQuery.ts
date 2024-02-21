import { useRouter } from 'next/router'

export function UseTestpersonQuery() {
    const router = useRouter()
    const testpersonQuery = router.query['testperson']

    return {
        query: (appended: boolean = false) => {
            if (testpersonQuery) {
                return `${appended ? '&' : '?'}testperson=${testpersonQuery}`
            }
            return ''
        },
    }
}
