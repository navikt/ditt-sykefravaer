import { PropsWithChildren, ReactElement } from 'react'
import { render, renderHook, screen, RenderOptions, RenderHookOptions, RenderHookResult } from '@testing-library/react'
import { IToggle } from '@unleash/nextjs'

import { FlagProvider } from '../../toggles/context'

import * as customQueries from './customQueries'

type ProviderProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly initialState?: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly mocks?: any[]
}

const testToggles: IToggle[] = [
    {
        name: 'SYKMELDINGER_FLEXJAR_KVITTERING',
        variant: { name: 'default', enabled: false },
        impressionData: false,
        enabled: false,
    },
]

function AllTheProviders({ children }: PropsWithChildren<ProviderProps>): ReactElement {
    return <FlagProvider toggles={testToggles}>{children}</FlagProvider>
}

const customRender = (
    ui: ReactElement,
    options: Omit<RenderOptions, 'queries'> & ProviderProps = {},
): ReturnType<typeof render> => {
    const { initialState, mocks, ...renderOptions } = options

    return render(ui, {
        wrapper: (props) => <AllTheProviders {...props} initialState={initialState} mocks={mocks} />,
        ...renderOptions,
    })
}

const customRenderHook = <TProps, TResult>(
    hook: (props: TProps) => TResult,
    options: Omit<RenderHookOptions<TProps>, 'wrapper'> & ProviderProps = {},
): RenderHookResult<TResult, TProps> => {
    const { initialState, mocks, ...renderOptions } = options

    return renderHook(hook, {
        wrapper: (props) => <AllTheProviders {...props} initialState={initialState} mocks={mocks} />,
        ...renderOptions,
    })
}

export async function openPlayground(): Promise<void> {}

export * from '@testing-library/react'

const customScreen = {
    ...screen,
    getRadioInGroup: customQueries.getRadioInGroup(screen)('radio'),
    getCheckboxInGroup: customQueries.getRadioInGroup(screen)('checkbox'),
    findRadioInGroup: customQueries.findRadioInGroup(screen),
}

export { customScreen as screen }
export { customRender as render, customRenderHook as renderHook }
