'use client'

import { useEffect, useState } from 'react'

interface CountryPanelProps {
  countryId: string
  onCompanySelect: (companyId: string) => void
}

export default function CountryPanel({ countryId, onCompanySelect }: CountryPanelProps) {
  const [pais, setPais] = useState<any>(null)
  const [empresasPais, setEmpresasPais] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [allPaises, setAllPaises] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        console.log(`📍 CountryPanel: Loading data for country: ${countryId}`)

        const [paisesRes, empresasRes] = await Promise.all([
          fetch('/data/paises.json'),
          fetch('/data/empresas_500.json'),
        ])

        if (!paisesRes.ok || !empresasRes.ok) {
          throw new Error(`Fetch failed: paises=${paisesRes.ok}, empresas=${empresasRes.ok}`)
        }

        const paises = await paisesRes.json()
        const empresas = await empresasRes.json()

        console.log(`📍 CountryPanel: Loaded ${paises.length} countries, ${empresas.length} companies`)
        console.log(`📍 CountryPanel: Looking for: "${countryId}"`)
        console.log(`📍 CountryPanel: Available codes:`, paises.map((p: any) => `"${p.id}"/"${p.codigo}"`).join(', '))

        // Store all paises for debugging
        setAllPaises(paises)

        let paisData = paises.find((p: any) => p.id === countryId || p.codigo === countryId)

        if (!paisData) {
          console.warn(`⚠️ País no encontrado para: ${countryId}`)
          console.log('Available country IDs:', paises.map((p: any) => p.id).join(', '))
          console.log('Available country codes:', paises.map((p: any) => p.codigo).join(', '))

          // Try exact case-insensitive match
          paisData = paises.find((p: any) =>
            p.id?.toUpperCase() === countryId?.toUpperCase() ||
            p.codigo?.toUpperCase() === countryId?.toUpperCase()
          )

          if (!paisData) {
            setError(`País "${countryId}" no encontrado. Códigos disponibles: ${paises.map((p: any) => p.codigo).join(', ')}`)
            setPais(null)
            setEmpresasPais([])
            setLoading(false)
            return
          }
        }

        console.log(`✅ Found country: ${paisData.nombre} (ID: ${paisData.id})`)
        setPais(paisData)

        const empresasDelPais = empresas.filter((e: any) => e.pais_id === paisData.id).slice(0, 10)
        console.log(`✅ Found ${empresasDelPais.length} companies for ${paisData.nombre}`)
        setEmpresasPais(empresasDelPais)
        setLoading(false)
      } catch (err: any) {
        console.error('❌ Error loading data:', err)
        setError(`Error: ${err.message}`)
        setLoading(false)
      }
    }

    loadData()
  }, [countryId])

  if (error) {
    return (
      <div className="p-5 text-[#ff3333]">
        <div className="text-sm font-bold mb-2">Error</div>
        <div className="text-xs">{error}</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-5 text-[#aaa]">
        Cargando información de {countryId}...
      </div>
    )
  }

  if (!pais) {
    return (
      <div className="p-5 text-[#aaa]">
        No se pudo cargar información del país {countryId}
      </div>
    )
  }

  return (
    <div className="p-5 space-y-6 text-sm overflow-y-auto max-h-full">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-white mb-2">{pais.nombre}</h2>
        <div className="text-xs text-[#aaa] space-y-1">
          <p>📊 GDP: ${(pais.gdp / 1e12).toFixed(1)}T</p>
          <p>👥 Población: {(pais.poblacion / 1e6).toFixed(1)}M</p>
          <p className="text-[#ff8c42]">Estado: {pais.embargo_status === 'none' ? '✓ Normal' : '⚠️ Embargo'}</p>
        </div>
      </div>

      {/* Industrias Clave */}
      <div>
        <div className="panel-title">Industrias Clave</div>
        <div className="flex flex-wrap gap-2">
          {pais.industrias_clave && pais.industrias_clave.length > 0 ? (
            pais.industrias_clave.map((ind: string, idx: number) => (
              <span
                key={idx}
                className="text-xs bg-[#1a1a1a] text-[#ff8c42] px-2 py-1 rounded border border-[#ff8c42]"
              >
                {ind}
              </span>
            ))
          ) : (
            <p className="text-xs text-[#aaa]">Sin información</p>
          )}
        </div>
      </div>

      {/* Empresas */}
      <div>
        <div className="panel-title">Empresas Clave ({empresasPais.length})</div>
        <div className="space-y-2">
          {empresasPais.length > 0 ? (
            empresasPais.map((empresa: any) => (
              <div
                key={empresa.id}
                className="bg-[#1a1a1a] p-3 rounded border border-[#333] hover:border-[#ff8c42] cursor-pointer transition-all"
                onClick={() => onCompanySelect(empresa.id)}
              >
                <div className="font-bold text-white">{empresa.nombre}</div>
                <div className="text-xs text-[#aaa] mt-1">
                  <p>{empresa.subsector || empresa.sector}</p>
                  <p className="text-[#ff8c42] mt-1">Cap: ${(empresa.cap_mercado / 1e9).toFixed(0)}B</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#aaa] text-xs">No hay empresas registradas</p>
          )}
        </div>
      </div>

      {/* Exportaciones Clave */}
      <div>
        <div className="panel-title">Exportaciones Principales</div>
        <ul className="text-xs text-[#aaa] space-y-1 list-disc list-inside">
          <li>Tecnología y Semiconductores</li>
          <li>Manufactura Avanzada</li>
          <li>Servicios Financieros</li>
        </ul>
      </div>

      {/* Recursos Críticos */}
      <div>
        <div className="panel-title">Dependencias de Recursos</div>
        <div className="text-xs text-[#aaa] space-y-1">
          <p>🪨 Minerales críticos: Limitados</p>
          <p>⚡ Energía: Importación parcial</p>
          <p>💾 Semiconductores: Importación crítica</p>
        </div>
      </div>
    </div>
  )
}
