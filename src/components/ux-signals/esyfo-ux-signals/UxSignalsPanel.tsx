import { isOpplaering } from '../../../utils/environment'

import useUxSignalsScript from './useUxSignals'

export default function UxSignalsPanel() {
    useUxSignalsScript(true)

    return (
        <div
            data-uxsignals-embed="panel-emwigf91dw"
            data-uxsignals-mode={isOpplaering() ? 'demo' : ''}
            className="mt-4"
        />
    )
}
