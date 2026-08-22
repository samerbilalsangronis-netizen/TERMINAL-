'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import TerminalHeader from '@/components/Header/TerminalHeader'

const MapContainer = dynamic(() => import('@/components/Map/MapContainer'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Cargando mapa...</div>
})

const CountryPanel = dynamic(() => import('@/components/Panels/CountryPanel'), {
  ssr: false,
  loading: () => <div className="w-80 bg-[#0a0a0a] border-l border-[#333]">Cargando...</div>
})

const SearchPanel = dynamic(() => import('@/components/Panels/SearchPanel'), {
  ssr: false,
})

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDependencies, setShowDependencies] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      {/* Header */}
      <TerminalHeader
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />

      {/* Contenido Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mapa */}
        <div className="flex-1">
          <MapContainer
            onCountrySelect={setSelectedCountry}
            selectedCountry={selectedCountry}
          />
        </div>

        {/* Panel Lateral */}
        {selectedCountry && (
          <div className="w-80 border-l border-[#333] overflow-y-auto bg-[#0a0a0a]">
            <CountryPanel
              countryId={selectedCountry}
              onCompanySelect={setSelectedCompany}
            />
          </div>
        )}

        {/* Panel de Búsqueda */}
        {searchTerm && (
          <div className="w-80 border-l border-[#333] overflow-y-auto bg-[#0a0a0a]">
            <SearchPanel
              searchTerm={searchTerm}
              onCompanySelect={setSelectedCompany}
            />
          </div>
        )}
      </div>

      {/* Estado Global (para debug) */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
