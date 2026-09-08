import { isMockBackend } from './environment'

export function dagensDato(): Date {
    if (isMockBackend()) {
        return new Date('2026-02-01T11:00:00.000Z')
    }

    return new Date()
}
