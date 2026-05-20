import { createContext, ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface LockSubmitContextType {
    isSubmitLocked: boolean
    addLock: (id: string) => void
    removeLock: (id: string) => void
}

const LockSubmitContext = createContext<LockSubmitContextType>({
    isSubmitLocked: false,
    addLock: () => void 0,
    removeLock: () => void 0,
})

export function LockSubmitProvider({ children }: { children: ReactNode }): ReactElement {
    const [locks, setLocks] = useState<Set<string>>(new Set())

    const addLock = useCallback((id: string) => {
        setLocks((prev) => {
            const next = new Set(prev)
            next.add(id)
            return next
        })
    }, [])

    const removeLock = useCallback((id: string) => {
        setLocks((prev) => {
            const next = new Set(prev)
            next.delete(id)
            return next
        })
    }, [])

    const value = useMemo(
        () => ({ isSubmitLocked: locks.size > 0, addLock, removeLock }),
        [locks.size, addLock, removeLock],
    )

    return <LockSubmitContext.Provider value={value}>{children}</LockSubmitContext.Provider>
}

/**
 * Hook that locks the submit button while `lock` is true.
 * Automatically removes the lock on unmount (e.g. when arbeidssituasjon changes).
 */
export function useLockSubmit(id: string, lock: boolean): void {
    const { addLock, removeLock } = useContext(LockSubmitContext)

    useEffect(() => {
        if (lock) {
            addLock(id)
        } else {
            removeLock(id)
        }
    }, [lock, id, addLock, removeLock])

    useEffect(() => {
        return () => removeLock(id)
    }, [id, removeLock])
}

export function useIsSubmitLocked(): boolean {
    return useContext(LockSubmitContext).isSubmitLocked
}
