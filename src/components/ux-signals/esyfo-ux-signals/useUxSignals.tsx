import { useEffect } from 'react'

export default function useUxSignalsScript(ready: boolean) {
  useEffect(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://widget.uxsignals.com/embed.js'
    if (ready) {
      document.body.appendChild(script)
    }

    return () => {
      try {
        document.body.removeChild(script)
      } catch {}
    }
  }, [ready])
}
