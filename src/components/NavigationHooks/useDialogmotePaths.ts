import useDialogmoter from '../../query-hooks/useDialogmoter'
import { DialogMote } from '../../types/dialogmote'
import { dialogmoteUrl, newDialogmoteUrl } from '../../utils/environment'

const hasUpcomingMoteplanleggerAlternativ = (
    moteplanlegger: DialogMote
): boolean => {
    const today = new Date()

    return (
        moteplanlegger.alternativer?.filter(
            (alternativ) => new Date(alternativ.tid) > today
        ).length > 0
    )
}

interface DialogmotePaths {
    dialogmoteLandingUrl: string
    svarMotebehovUrl: string
}

export const useDialogmotePaths = (): DialogmotePaths => {
    const moteplanleggerQuery = useDialogmoter()

    if (
        moteplanleggerQuery.data &&
        hasUpcomingMoteplanleggerAlternativ(moteplanleggerQuery.data)
    ) {
        return {
            dialogmoteLandingUrl: `${dialogmoteUrl()}`,
            svarMotebehovUrl: `${dialogmoteUrl()}/behov`,
        }
    }

    return {
        dialogmoteLandingUrl: `${newDialogmoteUrl()}`,
        svarMotebehovUrl: `${newDialogmoteUrl()}/motebehov/svar`,
    }
}
