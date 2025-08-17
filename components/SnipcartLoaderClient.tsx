'use client'

import { useEffect } from 'react'

export default function SnipcartLoaderClient() {
  useEffect(() => {
    // Configure Snipcart settings
    (window as any).SnipcartSettings = {
      locale: 'en-US',
      currency: 'USD',
    }

    // Inject Snipcart script if not already added
    if (!document.getElementById('snipcart-script')) {
      const script = document.createElement('script')
      script.id = 'snipcart-script'
      script.src = 'https://cdn.snipcart.com/themes/v3.4.1/default/snipcart.js'
      script.async = true
      document.body.appendChild(script)
    }

    // Inject Snipcart div if not already present
    if (!document.getElementById('snipcart')) {
      const div = document.createElement('div')
      div.id = 'snipcart'
      div.setAttribute(
        'data-api-key',
        process.env.NEXT_PUBLIC_SNIPCART_API_KEY || ''
      )
      div.setAttribute('hidden', 'true')
      div.setAttribute('data-config-modal-style', 'side')
      document.body.appendChild(div)
    }
  }, [])

  return null
}
