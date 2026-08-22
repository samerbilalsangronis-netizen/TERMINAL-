// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import paises from '@/data/paises.json'
import empresas from '@/data/empresas_500.json'
import { Pais, Empresa } from '@/types'

interface CountryPanelProps {
  countryId: string
  onCompanySelect: (companyId: string) => void
}

export default function CountryPanel({ countryId, onCompanySelect }: CountryPanelProps) {
  const [pais, setPais] = useState<Pais | null>(null)
  const [empresasPais, setEmpresasPais] = useState<Empresa[]>([])

  useEffect(() => {
    const paisData = paises.find(p => p.codigo === countryId)
    setPais(paisData || null)

    if (paisData) {
      const empresasDelPais = empresas.filter(e => e.pais_id === paisData.id).slice(0, 10)
      setEmpresasPais(empresasDelPais)
    }
  }, [countryId])

  if (!pais) {
    return (
      <div className="p-5 text-[#aaa]">
        Cargando información del país...
      </div>
    )
  }

  return (
    <div className="p-5 space-y-6 text-sm">
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

      {/* Empresas */}
      <div>
        <div className="panel-title">Empresas Clave</div>
        <div className="space-y-2">
          {empresasPais.length > 0 ? (
            empresasPais.map(empresa => (
              <div
                key={empresa.id}
                className="bg-[#1a1a1a] p-3 rounded border border-[#333] hover:border-[#ff8c42] cursor-pointer transition-all"
                onClick={() => onCompanySelect(empresa.id)}
              >
                <div className="font-bold text-white">{empresa.nombre}</div>
                <div className="text-xs text-[#aaa] mt-1">
                  <p>{empresa.subsector}</p>
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
