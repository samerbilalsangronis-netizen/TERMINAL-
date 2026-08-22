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
    <div className="terminal-header">
      {/* Buscador */}
      <input
        type="text"
        className="search-box"
        placeholder="<Search>"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {/* Botón Acciones */}
      <button className="btn-action">
        Actions ▼
      </button>

      {/* Navegación de Tabs */}
      <div className="flex gap-0 ml-auto">
        {['Map', 'Table', 'News'].map((tab) => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reloj UTC */}
      <div className="ml-auto flex items-center gap-2 text-xs font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
        <span className="text-[#aaa]">UTC</span>
        <span className="text-[#ff8c42] font-bold tabular-nums min-w-[62px] text-right">
          {utcTime ?? '--:--:--'}
        </span>
      </div>
    </div>
  )
}
