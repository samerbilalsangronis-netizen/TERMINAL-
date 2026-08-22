import { useState } from 'react'

interface Bottleneck {
  id: string
  nombre: string
  pais: string
  latitud: number
  longitud: number
  tipo: string
  criticidad: string
  porcentaje_global: number
  impacto_sectores: string[]
  descripcion: string
  vulnerabilidades: string[]
  empresas_afectadas: string[]
  consecuencias_si_falla: string
  color: string
}

interface BottleneckPanelProps {
  bottleneck: Bottleneck
  onClose: () => void
}

export default function BottleneckPanel({ bottleneck, onClose }: BottleneckPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('vulnerabilidades')

  const getCriticidadColor = (criticidad: string) => {
    switch (criticidad) {
      case 'CRÍTICA':
        return '#ff3333'
      case 'ALTA':
        return '#ff9900'
      case 'MEDIA':
        return '#ffaa00'
      default:
        return '#00d4ff'
    }
  }

  const getCriticidadBorder = (criticidad: string) => {
    switch (criticidad) {
      case 'CRÍTICA':
        return 'border-l-4 border-l-[#ff3333]'
      case 'ALTA':
        return 'border-l-4 border-l-[#ff9900]'
      case 'MEDIA':
        return 'border-l-4 border-l-[#ffaa00]'
      default:
        return 'border-l-4 border-l-[#00d4ff]'
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a0a] overflow-hidden animate-slide-in">
      {/* Header */}
      <div className={`px-4 py-5 border-b border-[#2a2a2a] ${getCriticidadBorder(bottleneck.criticidad)}`}
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,140,66,0.03) 0%, transparent 100%)`,
          borderBottom: `1px solid ${getCriticidadColor(bottleneck.criticidad)}40`
        }}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="text-xs font-bold text-[#b0b0b0] uppercase tracking-widest mb-1 opacity-70">
              CUELLO DE BOTELLA
            </div>
            <h2 className="text-sm font-bold text-white leading-tight">{bottleneck.nombre}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#b0b0b0] hover:text-[#ff8c42] text-lg leading-none ml-3 transition-colors"
            aria-label="Cerrar panel"
          >
            ✕
          </button>
        </div>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <div
            className="px-2 py-1 text-xs font-mono font-bold rounded border text-white transition-all"
            style={{
              color: getCriticidadColor(bottleneck.criticidad),
              borderColor: getCriticidadColor(bottleneck.criticidad),
              boxShadow: `0 0 8px ${getCriticidadColor(bottleneck.criticidad)}40`
            }}
          >
            ◆ {bottleneck.criticidad}
          </div>
          <div className="px-2 py-1 text-xs font-mono font-bold rounded border border-[#00d4ff] text-[#00d4ff]"
            style={{ boxShadow: '0 0 8px rgba(0,212,255,0.2)' }}>
            ● {bottleneck.porcentaje_global}%
          </div>
          <div className="px-2 py-1 text-xs font-mono font-bold rounded border border-[#7a7a7a] text-[#b0b0b0]">
            ▧ {bottleneck.tipo}
          </div>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,140,66,0.01) 0px, rgba(255,140,66,0.01) 1px, transparent 1px, transparent 8px)'
      }}>
        {/* Descripción general */}
        <div className="panel-section">
          <div className="panel-title">Descripción</div>
          <p className="panel-content text-[11px] leading-relaxed">{bottleneck.descripcion}</p>
        </div>

        {/* País */}
        <div className="panel-section">
          <div className="panel-title">Localización</div>
          <div className="text-xs font-mono text-[#00d4ff]" style={{ textShadow: '0 0 8px rgba(0,212,255,0.3)' }}>
            {bottleneck.pais}
          </div>
          <div className="text-[10px] text-[#b0b0b0] font-mono mt-1 opacity-70">
            {bottleneck.latitud.toFixed(4)}° N, {Math.abs(bottleneck.longitud).toFixed(4)}° W
          </div>
        </div>

        {/* Sectores impactados */}
        <div className="panel-section">
          <button
            onClick={() => toggleSection('sectores')}
            className="w-full flex justify-between items-center"
          >
            <div className="panel-title m-0">Sectores Impactados</div>
            <span className="text-[#ff8c42] transition-transform" style={{
              transform: expandedSection === 'sectores' ? 'rotate(180deg)' : 'rotate(0deg)',
              transitionDuration: '200ms'
            }}>
              ▼
            </span>
          </button>
          {expandedSection === 'sectores' && (
            <div className="mt-3 space-y-1 ml-1">
              {bottleneck.impacto_sectores.map((sector, idx) => (
                <div
                  key={idx}
                  className="text-xs text-[#ff9900] font-mono py-1 pl-2 border-l-2 border-[#ff9900] opacity-80 hover:opacity-100 transition-opacity"
                >
                  ⚡ {sector}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vulnerabilidades */}
        <div className="panel-section">
          <button
            onClick={() => toggleSection('vulnerabilidades')}
            className="w-full flex justify-between items-center"
          >
            <div className="panel-title m-0">Vulnerabilidades</div>
            <span className="text-[#ff3333] transition-transform" style={{
              transform: expandedSection === 'vulnerabilidades' ? 'rotate(180deg)' : 'rotate(0deg)',
              transitionDuration: '200ms'
            }}>
              ▼
            </span>
          </button>
          {expandedSection === 'vulnerabilidades' && (
            <div className="mt-3 space-y-1 ml-1">
              {bottleneck.vulnerabilidades.map((vuln, idx) => (
                <div
                  key={idx}
                  className="text-xs text-[#ff3333] font-mono py-1 pl-2 border-l-2 border-[#ff3333] opacity-80 hover:opacity-100 transition-opacity"
                >
                  ⚠️ {vuln}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empresas afectadas */}
        <div className="panel-section">
          <button
            onClick={() => toggleSection('empresas')}
            className="w-full flex justify-between items-center"
          >
            <div className="panel-title m-0">Empresas Afectadas</div>
            <span className="text-[#00d4ff] transition-transform" style={{
              transform: expandedSection === 'empresas' ? 'rotate(180deg)' : 'rotate(0deg)',
              transitionDuration: '200ms'
            }}>
              ▼
            </span>
          </button>
          {expandedSection === 'empresas' && (
            <div className="mt-3 space-y-1 ml-1">
              {bottleneck.empresas_afectadas.map((empresa, idx) => (
                <div
                  key={idx}
                  className="text-xs text-[#00d4ff] font-mono py-1 pl-2 border-l-2 border-[#00d4ff] opacity-80 hover:opacity-100 transition-opacity"
                >
                  🏢 {empresa}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consecuencias si falla */}
        <div className="panel-section border-b-0">
          <div className="panel-title">Consecuencias Si Falla</div>
          <div className="text-xs text-[#b0b0b0] leading-relaxed p-3 rounded-sm border-l-4 border-l-[#ff3333] bg-[#ff3333]"
            style={{
              backgroundColor: 'rgba(255, 51, 51, 0.08)',
              boxShadow: 'inset 0 0 8px rgba(255, 51, 51, 0.1)'
            }}>
            {bottleneck.consecuencias_si_falla}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#2a2a2a] bg-gradient-to-r from-[#1a1a1a] to-transparent text-[10px] text-[#7a7a7a] font-mono text-center tracking-widest"
        style={{ borderTopColor: `${getCriticidadColor(bottleneck.criticidad)}20` }}>
        ▌ ANÁLISIS GEOPOLÍTICO • FASE 5 ▌
      </div>
    </div>
  )
}
