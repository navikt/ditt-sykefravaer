import { IToggle } from '@unleash/nextjs'

import { isProd } from '../utils/environment'

import { EXPECTED_TOGGLES } from './toggles'

export function localDevelopmentToggles(req?: { query?: Record<string, string | string[] | undefined> }): IToggle[] {
    return EXPECTED_TOGGLES.map((it): IToggle => {
        const queryParamValue = req?.query?.[`toggle_${it}`]
        const queryParamEnabled = queryParamValue === 'true' ? true : queryParamValue === 'false' ? false : undefined
        const enabled = queryParamEnabled ?? true

        return {
            name: it,
            enabled,
            impressionData: false,
            variant: {
                name: 'disabled',
                enabled: false,
            },
        }
    })
}

export function getUnleashEnvironment(): 'development' | 'production' {
    if (isProd()) {
        return 'production'
    }
    return 'development'
}
