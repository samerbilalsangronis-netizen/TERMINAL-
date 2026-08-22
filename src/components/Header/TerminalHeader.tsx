'use client'

import { useState } from 'react'

interface TerminalHeaderProps {
  onSearch: (term: string) => void
  searchTerm: string
}

export default function TerminalHeader({ onSearch, searchTerm }: TerminalHeaderProps) {
  const [activeTab, setActiveTab] = useState('Map')

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

      {/* Custom Map */}
      <div className="ml-auto text-[#ff8c42] text-xs font-bold">
        Custom Map
      </div>
    </div>
  )
}
