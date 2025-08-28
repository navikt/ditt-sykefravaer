export function urlAppendPath(url: string, subPath: string): string {
    const dummyBaseUrlForRelativeUrls = 'http://dummy'
    const u = new URL(url, dummyBaseUrlForRelativeUrls)
    const normalizedBase = u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname
    const normalizedSub = subPath.startsWith('/') ? subPath : `/${subPath}`
    u.pathname = normalizedBase + normalizedSub
    return u.origin === dummyBaseUrlForRelativeUrls ? u.pathname + u.search + u.hash : u.toString()
}
