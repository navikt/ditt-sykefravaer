import useUxSignalsScript from './useUxSignals'
import { isOpplaering } from '../../../utils/environment'

export default function UxSignalsPanel() {
  useUxSignalsScript(true)

  return <div data-uxsignals-embed="panel-emwigf91dw" data-uxsignals-mode={isOpplaering() ? 'demo' : ''} className="mt-4"/>
}
