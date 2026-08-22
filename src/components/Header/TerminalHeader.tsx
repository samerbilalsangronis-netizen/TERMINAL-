'use client'

import { useEffect, useState } from 'react'

interface TerminalHeaderProps {
  onSearch: (term: string) => void
  searchTerm: string
}

function formatUTC(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
}

export default function TerminalHeader({ onSearch, searchTerm }: TerminalHeaderProps) {
  const [activeTab, setActiveTab] = useState('Map')
  const [searchFocused, setSearchFocused] = useState(false)
  const [utcTime, setUtcTime] = useState<string | null>(null)

  useEffect(() => {
    setUtcTime(formatUTC(new Date()))
    const interval = setInterval(() => setUtcTime(formatUTC(new Date())), 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchChange = (value: string) => {
    onSearch(value)
  }

  return (
    <div className="terminal-header animate-fade-in">
      {/* Logo/Title Section */}
      <div className="flex items-center gap-2">
        <div className="text-10px font-bold text-[#ff8c42] tracking-widest">
          █ TERMINAL
        </div>
        <div className="text-10px font-medium text-[#b0b0b0] tracking-widest">
          BLOOMBERG
        </div>
      </div>

      {/* Divisor */}
      <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#ff8c42] to-transparent opacity-30"></div>

      {/* Buscador */}
      <input
        type="text"
        className={`search-box transition-all ${
          searchFocused ? 'ring-1 ring-[#00d4ff]' : ''
        }`}
        placeholder="<Buscar>"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        aria-label="Buscador de terminal"
      />

      {/* Botón Acciones */}
      <button
        className="btn-action hover:shadow-lg"
        title="Menú de acciones"
        aria-label="Abrir menú de acciones"
      >
        <span className="inline-block">⚙ ACCIONES</span>
      </button>

      {/* Divisor */}
      <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-[#ff8c42] to-transparent opacity-30"></div>

      {/* Navegación de Tabs */}
      <div className="flex gap-0 ml-auto hidden sm:flex">
        {['Map', 'Table', 'News'].map((tab) => (
          <button
            key={tab}
            className={`nav-tab transition-all ${
              activeTab === tab ? 'active' : 'hover:text-[#ff8c42]'
            }`}
            onClick={() => setActiveTab(tab)}
            aria-label={`Vista de ${tab}`}
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {tab === 'Map' && '🗺'}
            {tab === 'Table' && '📊'}
            {tab === 'News' && '📰'}
            <span className="ml-1">{tab}</span>
          </button>
        ))}
      </div>

      {/* Info Section */}
      <div className="ml-auto hidden md:flex items-center gap-3">
        <div className="flex items-center gap-1 text-[10px]">
          <span className="inline-block w-2 h-2 bg-[#00cc88] rounded-full animate-pulse"></span>
          <span className="text-[#b0b0b0] tracking-wide">EN LÍNEA</span>
        </div>
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#ff8c42] to-transparent opacity-30"></div>
        <div className="flex items-center gap-1 text-[10px] font-mono">
          <span className="text-[#b0b0b0] tracking-wide">UTC</span>
          <span className="text-[#ff8c42] font-bold tabular-nums min-w-[56px] text-right">
            {utcTime ?? '--:--:--'}
          </span>
        </div>
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#ff8c42] to-transparent opacity-30"></div>
        <div className="text-[10px] font-bold text-[#ff8c42] tracking-widest">
          FASE 5 ✓
        </div>
      </div>
    </div>
  )
}
