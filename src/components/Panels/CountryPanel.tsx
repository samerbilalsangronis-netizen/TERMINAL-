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
  onClose: () => void
}

export default function CountryPanel({ countryId, onCompanySelect, onClose }: CountryPanelProps) {
  const [pais, setPais] = useState<Pais | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Se activa un frame después de montar para que la transición de
    // entrada (opacity/scale) realmente se anime en vez de arrancar ya
    // en su estado final.
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

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

  return (
    <div
      className={`absolute inset-0 z-20 bg-[rgba(5,5,5,0.92)] backdrop-blur-[2px] flex flex-col transition-opacity duration-300 ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Botón cerrar: vuelve al mapa completo */}
      <button
        onClick={onClose}
        className="absolute top-4 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-full border border-[#333] bg-[rgba(10,10,10,0.9)] text-[#aaa] hover:text-white hover:border-[#ff8c42] text-lg transition-all"
        title="Cerrar y volver al mapa"
      >
        ✕
      </button>

      <div
        className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ease-out ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-[#aaa] text-sm">
            Cargando información del país...
          </div>
        ) : !pais ? (
          <div className="flex-1 flex items-center justify-center text-[#aaa] text-sm">
            País no encontrado.
          </div>
        ) : (
          <>
            {/* Info condensada del país, arriba del árbol */}
            <div className="px-6 pt-5 pb-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] text-[#aaa]">
              <span>📊 GDP: <span className="text-white">${(pais.gdp / 1e12).toFixed(1)}T</span></span>
              <span>👥 Población: <span className="text-white">{(pais.poblacion / 1e6).toFixed(1)}M</span></span>
              <span className="text-[#ff8c42]">{pais.embargo_status === 'none' ? '✓ Normal' : '⚠️ Embargo'}</span>
              {pais.industrias_clave.slice(0, 4).map((ind, idx) => (
                <span key={idx} className="bg-[#1a1a1a] text-[#ff8c42] px-2 py-0.5 rounded border border-[#ff8c42]">
                  {ind}
                </span>
              ))}
            </div>

            {/* Mapa de empresas por sector */}
            <div className="flex-1 flex flex-col min-h-0">
              <CountrySectorTree countryId={countryId} onCompanySelect={onCompanySelect} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
