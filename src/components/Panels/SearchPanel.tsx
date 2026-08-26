// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { Empresa } from '@/types'
import { supabase } from '@/lib/supabase'

interface SearchPanelProps {
  searchTerm: string
  onCompanySelect: (companyId: string) => void
}

export default function SearchPanel({ searchTerm, onCompanySelect }: SearchPanelProps) {
  const [resultados, setResultados] = useState<Empresa[]>([])
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        const { data, error } = await supabase.from('empresas').select('*')
        if (error) throw error
        setEmpresas(data || [])
      } catch (error) {
        console.error('Error loading empresas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEmpresas()
  }, [])

  useEffect(() => {
    if (!searchTerm || loading) {
      setResultados([])
      return
    }

    const termLower = searchTerm.toLowerCase()
    const filtered = empresas.filter(
      (empresa: any) =>
        empresa.nombre.toLowerCase().includes(termLower) ||
        empresa.ticker.toLowerCase().includes(termLower) ||
        empresa.sector.toLowerCase().includes(termLower) ||
        empresa.subsector.toLowerCase().includes(termLower)
    )

    setResultados(filtered)
  }, [searchTerm, empresas, loading])

  return (
    <div className="p-5 space-y-4 text-sm">
      <div>
        <div className="panel-title">Resultados de Búsqueda</div>
        <p className="text-xs text-[#aaa] mb-3">
          Encontrados: <span className="text-[#ff8c42] font-bold">{resultados.length}</span> resultados
        </p>
      </div>

      {resultados.length > 0 ? (
        <div className="space-y-2">
          {resultados.map(empresa => (
            <div
              key={empresa.id}
              className="bg-[#1a1a1a] p-3 rounded border border-[#333] hover:border-[#ff8c42] cursor-pointer transition-all"
              onClick={() => onCompanySelect(empresa.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-white">{empresa.nombre}</div>
                  <div className="text-xs text-[#aaa] mt-1">
                    {empresa.ticker} • {empresa.sector}
                  </div>
                </div>
                <div className="text-xs font-mono text-[#ff8c42]">
                  ${(empresa.cap_mercado / 1e9).toFixed(0)}B
                </div>
              </div>
              <div className="text-xs text-[#888] mt-2 italic">
                {empresa.descripcion}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[#aaa] text-xs py-8 text-center">
          {searchTerm ? 'No se encontraron resultados' : 'Escribe para buscar empresas, sectores o productos'}
        </div>
      )}

      {/* Sugerencias de búsqueda */}
      {!searchTerm && (
        <div className="border-t border-[#333] pt-4">
          <div className="panel-title text-xs mb-2">Búsquedas Populares</div>
          <div className="space-y-1 text-xs text-[#aaa]">
            <p>• "Semiconductores"</p>
            <p>• "NVIDIA"</p>
            <p>• "Chips IA"</p>
            <p>• "Tecnología"</p>
          </div>
        </div>
      )}
    </div>
  )
}
