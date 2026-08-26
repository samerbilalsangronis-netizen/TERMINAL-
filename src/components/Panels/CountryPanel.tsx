'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Pais } from '@/types'
import { supabase } from '@/lib/supabase'

const CountrySectorTree = dynamic(() => import('@/components/Graph/CountrySectorTree'), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center text-[#aaa] text-xs">Cargando mapa de empresas...</div>
})

interface CountryPanelProps {
  countryId: string
  onCompanySelect: (companyId: string) => void
}

export default function CountryPanel({ countryId, onCompanySelect }: CountryPanelProps) {
  const [pais, setPais] = useState<Pais | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPais = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('paises')
          .select('*')
          .eq('codigo', countryId)
          .maybeSingle()
        if (error) throw error
        setPais(data || null)
      } catch (error) {
        console.error('Error loading país:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPais()
  }, [countryId])

  if (loading) {
    return (
      <div className="p-5 text-[#aaa] text-sm">
        Cargando información del país...
      </div>
    )
  }

  if (!pais) {
    return (
      <div className="p-5 text-[#aaa] text-sm">
        País no encontrado.
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Encabezado */}
      <div className="p-5 pb-3 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{pais.nombre}</h2>
          <div className="text-xs text-[#aaa] space-y-1">
            <p>📊 GDP: ${(pais.gdp / 1e12).toFixed(1)}T</p>
            <p>👥 Población: {(pais.poblacion / 1e6).toFixed(1)}M</p>
            <p className="text-[#ff8c42]">Estado: {pais.embargo_status === 'none' ? '✓ Normal' : '⚠️ Embargo'}</p>
          </div>
        </div>

        <div>
          <div className="panel-title">Industrias Clave</div>
          <div className="flex flex-wrap gap-2">
            {pais.industrias_clave.map((ind, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#1a1a1a] text-[#ff8c42] px-2 py-1 rounded border border-[#ff8c42]"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa de empresas por sector */}
      <div className="flex-1 border-t border-[#333] flex flex-col min-h-0">
        <div className="panel-title px-5 pt-3">Empresas por Sector</div>
        <CountrySectorTree countryId={countryId} onCompanySelect={onCompanySelect} />
      </div>
    </div>
  )
}
