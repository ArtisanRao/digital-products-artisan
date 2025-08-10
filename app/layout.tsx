'use client'

import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-blue-100 overflow-x-hidden">
      <div className="container mx-auto px-4 py-2">
        <h1 className="text-blue-700 font-bold text-lg">Test Header</h1>
      </div>
    </header>
  )
}
