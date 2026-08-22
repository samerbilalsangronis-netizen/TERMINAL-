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

const AdvancedSearchPanel = dynamic(() => import('@/components/Panels/AdvancedSearchPanel'), {
  ssr: false,
  loading: () => <div className="w-96 bg-[#0a0a0a] border-l border-[#333]">Buscando...</div>
})

const CompanyPanel = dynamic(() => import('@/components/Panels/CompanyPanel'), {
  ssr: false,
  loading: () => <div className="w-96 bg-[#0a0a0a] border-l border-[#333]">Cargando empresa...</div>
})

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Debug: mostrar cambios en estado
  useEffect(() => {
    console.log('🌍 País seleccionado:', selectedCountry)
    console.log('📊 Estado actual - selectedCountry:', selectedCountry, 'selectedCompany:', selectedCompany, 'searchTerm:', searchTerm)
  }, [selectedCountry, selectedCompany, searchTerm])

  useEffect(() => {
    console.log('🏢 Empresa seleccionada:', selectedCompany)
  }, [selectedCompany])

  // Listener para eventos de selección desde el grafo
  useEffect(() => {
    const handleSelectCompany = (event: Event) => {
      const customEvent = event as CustomEvent
      setSelectedCompany(customEvent.detail)
    }

    window.addEventListener('selectCompany', handleSelectCompany)
    return () => window.removeEventListener('selectCompany', handleSelectCompany)
  }, [])

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
        {selectedCompany ? (
          <div className="w-96 border-l border-[#333] overflow-y-auto bg-[#0a0a0a]">
            <CompanyPanel
              companyId={selectedCompany}
              onClose={() => setSelectedCompany(null)}
            />
          </div>
        ) : selectedCountry ? (
          <div className="w-80 border-l border-[#333] overflow-y-auto bg-[#0a0a0a]">
            <CountryPanel
              countryId={selectedCountry}
              onCompanySelect={setSelectedCompany}
            />
          </div>
        ) : searchTerm ? (
          <div className="w-96 border-l border-[#333] overflow-y-auto bg-[#0a0a0a]">
            <AdvancedSearchPanel
              searchTerm={searchTerm}
              onCompanySelect={setSelectedCompany}
            />
          </div>
        ) : null}
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
