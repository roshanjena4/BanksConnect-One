"use client"

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { X, Download } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = typeof window !== 'undefined' ? localStorage.getItem('installPromptDismissed') : null
    if (dismissed) return

    const handler = (e: Event) => {
      const ev = e as BeforeInstallPromptEvent
      ev.preventDefault()
      setDeferredPrompt(ev)
      // show prompt UI after short delay so page content settles
      setTimeout(() => setVisible(true), 500)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    // record user action
    if (choiceResult.outcome === 'accepted') {
      localStorage.setItem('installPromptDismissed', 'true')
      setVisible(false)
    } else {
      // If dismissed, hide and don't show again for now
      localStorage.setItem('installPromptDismissed', 'true')
      setVisible(false)
    }
  }

  const handleLater = () => {
    localStorage.setItem('installPromptDismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed right-6 bottom-6 z-50 max-w-xs w-full bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-md bg-teal-600 text-white flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Install App</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Install this app for offline access and better performance.</p>
          <div className="mt-3 flex items-center gap-2">
            <Button onClick={handleInstall} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
            <Button variant="ghost" onClick={handleLater} className="ml-2">
              Later
            </Button>
          </div>
        </div>
        <button onClick={() => { localStorage.setItem('installPromptDismissed', 'true'); setVisible(false) }} className="ml-2 text-gray-400 hover:text-gray-600">
          <X />
        </button>
      </div>
    </div>
  )
}
