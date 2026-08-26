'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '@/lib/supabase'

const BottleneckLayer = dynamic(() => import('./BottleneckLayer'), { ssr: false })
const VesselLayer = dynamic(() => import('./VesselLayer'), { ssr: false })

type VesselStatus = 'idle' | 'connecting' | 'connected' | 'error'

const AIS_KEY_STORAGE = 'terminal_aisstream_api_key'
// Key pública del proyecto (se define en el entorno de build, no en el código
// fuente) para que el tráfico marítimo funcione sin pedir key a cada visitante.
const AIS_ENV_KEY = process.env.NEXT_PUBLIC_AISSTREAM_API_KEY || null

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

interface MapContainerProps {
  onCountrySelect: (countryId: string) => void
  selectedCountry: string | null
  onBottleneckSelect?: (bottleneck: Bottleneck) => void
  selectedBottleneck?: string | null
}

export default function MapContainer({
  onCountrySelect,
  selectedCountry,
  onBottleneckSelect,
  selectedBottleneck
}: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [coords, setCoords] = useState({ lat: 0, lon: 0 })
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([])
  const [borderError, setBorderError] = useState(false)
  const [vesselsEnabled, setVesselsEnabled] = useState(false)
  const [aisApiKey, setAisApiKey] = useState<string | null>(AIS_ENV_KEY)
  const [vesselStatus, setVesselStatus] = useState<VesselStatus>('idle')
  const [vesselCount, setVesselCount] = useState(0)
  const [showKeyPrompt, setShowKeyPrompt] = useState(false)
  const [keyInput, setKeyInput] = useState('')

  // Si no hay key del proyecto, permitir que cada visitante use la suya
  // propia guardada solo en su navegador (nunca en el repo)
  useEffect(() => {
    if (AIS_ENV_KEY) return
    const saved = window.localStorage.getItem(AIS_KEY_STORAGE)
    if (saved) setAisApiKey(saved)
  }, [])

  // Referencia estable: si esta función se recreara en cada render, el
  // useEffect de VesselLayer (que depende de ella) cerraría y reabriría el
  // WebSocket en cada actualización de estado, matándolo antes de conectar.
  const handleVesselStatusChange = useCallback((status: VesselStatus, count: number) => {
    setVesselStatus(status)
    setVesselCount(count)
  }, [])

  // Misma razón: referencia estable para no reconstruir las capas de
  // cuellos de botella en cada render.
  const handleBottleneckSelect = useCallback((bottleneck: Bottleneck) => {
    onBottleneckSelect?.(bottleneck)
  }, [onBottleneckSelect])

  const handleToggleVessels = () => {
    if (vesselsEnabled) {
      setVesselsEnabled(false)
      return
    }
    if (aisApiKey) {
      setVesselsEnabled(true)
    } else {
      setKeyInput('')
      setShowKeyPrompt(true)
    }
  }

  const handleSaveKey = () => {
    const trimmed = keyInput.trim()
    if (!trimmed) return
    window.localStorage.setItem(AIS_KEY_STORAGE, trimmed)
    setAisApiKey(trimmed)
    setShowKeyPrompt(false)
    setVesselsEnabled(true)
  }

  // Store callback en ref
  const callbackRef = useRef<typeof onCountrySelect>(onCountrySelect)
  useEffect(() => {
    callbackRef.current = onCountrySelect
  }, [onCountrySelect])

  // Cargar cuellos de botella
  useEffect(() => {
    const loadBottlenecks = async () => {
      try {
        const { data, error } = await supabase.from('cuellos_botella').select('*')
        if (error) throw error
        setBottlenecks(data || [])
      } catch (err) {
        console.error('Error cargando cuellos:', err)
      }
    }
    loadBottlenecks()
  }, [])

  // Inicializar mapa
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map('map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: false,
      attributionControl: true,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CartoDB',
      maxZoom: 19,
    }).addTo(map)

    addGridlines(map)

    // Cargar GeoJSON de países
    console.log('[MapContainer] Iniciando fetch de GeoJSON...')
    fetch('/data/countries.geojson')
      .then(res => {
        console.log('[MapContainer] Respuesta fetch:', res.status, res.statusText)
        return res.json()
      })
      .then(data => {
        console.log('[MapContainer] GeoJSON cargado:', data.features?.length, 'características')
        L.geoJSON(data, {
          style: {
            color: '#ff8c42',
            weight: 1.5,
            opacity: 0.6,
            fillColor: '#4a4a4a',
            fillOpacity: 0.95,
          },
          onEachFeature: (feature: any, layer: any) => {
            const countryName = feature.properties.name || 'País'
            const countryCode = feature.properties['ISO3166-1-Alpha-2'] || ''
            console.log('[MapContainer] onEachFeature:', countryName, countryCode)

            layer.on('click', () => {
              console.log('[MapContainer] Click en país:', countryCode)
              if (callbackRef.current) {
                callbackRef.current(countryCode)
              }
              layer.setStyle({
                color: '#ff8c42',
                weight: 2.5,
                opacity: 1,
                fillOpacity: 1,
              })
            })

            layer.on('mouseover', () => {
              layer.setStyle({ color: '#ff8c42', weight: 2, opacity: 1 })
              layer.bindTooltip(countryName, {
                permanent: false,
                direction: 'top',
                className: 'country-tooltip'
              }).openTooltip()
            })

            layer.on('mouseout', () => {
              if (selectedCountry !== countryCode) {
                layer.setStyle({
                  color: '#ff8c42',
                  weight: 1.5,
                  opacity: 0.6,
                })
              }
              layer.closeTooltip()
            })
          }
        }).addTo(map)
      })
      .catch(err => {
        console.error('[MapContainer] Error en GeoJSON fetch:', err.message, err)
        setBorderError(true)
      })

    mapRef.current = map

    map.on('mousemove', (e) => {
      setCoords({
        lat: parseFloat(e.latlng.lat.toFixed(4)),
        lon: parseFloat(e.latlng.lng.toFixed(4)),
      })
    })

    // Controles
    const zoomInBtn = document.getElementById('zoomIn')
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => map.zoomIn())

    const zoomOutBtn = document.getElementById('zoomOut')
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => map.zoomOut())

    const resetBtn = document.getElementById('resetView')
    if (resetBtn) resetBtn.addEventListener('click', () => map.setView([20, 0], 2))

  }, [])

  function addGridlines(map: L.Map) {
    const gridColor = '#333333'
    const gridOpacity = 0.3

    for (let lat = -80; lat <= 80; lat += 20) {
      L.polyline(
        [[lat, -180], [lat, 180]],
        { color: gridColor, weight: 1, opacity: gridOpacity, dashArray: '3, 3', interactive: false }
      ).addTo(map)
    }

    for (let lon = -180; lon <= 180; lon += 30) {
      L.polyline(
        [[-80, lon], [80, lon]],
        { color: gridColor, weight: 1, opacity: gridOpacity, dashArray: '3, 3', interactive: false }
      ).addTo(map)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full isolate" />

      {mapRef.current && (
        <BottleneckLayer
          map={mapRef.current}
          bottlenecks={bottlenecks}
          onBottleneckSelect={handleBottleneckSelect}
          selectedBottleneck={selectedBottleneck || null}
        />
      )}

      {mapRef.current && (
        <VesselLayer
          map={mapRef.current}
          apiKey={aisApiKey}
          enabled={vesselsEnabled}
          onStatusChange={handleVesselStatusChange}
        />
      )}

      {/* Control de tráfico marítimo en vivo (AISStream) */}
      <div className="absolute top-4 right-5 z-10 flex flex-col items-end gap-2">
        <button
          onClick={handleToggleVessels}
          className={`text-xs font-bold px-3 py-2 rounded-sm border transition-all ${
            vesselsEnabled
              ? 'bg-[#00d4ff] text-black border-[#00d4ff]'
              : 'bg-[rgba(10,10,10,0.95)] text-[#aaa] border-[#333] hover:border-[#00d4ff]'
          }`}
        >
          🚢 Tráfico Marítimo en Vivo
        </button>
        {vesselsEnabled && (
          <div className="bg-[rgba(10,10,10,0.95)] border border-[#333] px-3 py-1.5 rounded-sm text-[10px] font-mono text-[#aaa]">
            {vesselStatus === 'connecting' && '⏳ Conectando a AISStream...'}
            {vesselStatus === 'error' && <span className="text-[#ff3333]">⚠ Error de conexión, reintentando...</span>}
            {vesselStatus === 'connected' && (
              <span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] inline-block mr-1 animate-pulse" />
                {vesselCount} buques en cuellos de botella
              </span>
            )}
          </div>
        )}
      </div>

      {/* Formulario de API key de AISStream (se guarda solo en este navegador) */}
      {showKeyPrompt && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 animate-fade-in">
          <div className="bg-[#0a0a0a] border border-[#00d4ff] rounded-sm p-5 w-96 text-xs">
            <div className="text-white font-bold text-sm mb-2">🚢 Activar tráfico marítimo en vivo</div>
            <p className="text-[#aaa] mb-3 leading-relaxed">
              Usa datos AIS gratuitos de{' '}
              <a
                href="https://aisstream.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00d4ff] underline"
              >
                aisstream.io
              </a>
              . Crea una cuenta gratuita, copia tu API key y pégala aquí. Se guarda solo en
              este navegador (localStorage) — nunca se envía a nuestros servidores.
            </p>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
              placeholder="Pega tu API key de AISStream"
              autoFocus
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-sm px-3 py-2 text-white text-xs mb-3 focus:outline-none focus:border-[#00d4ff]"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowKeyPrompt(false)}
                className="px-3 py-1.5 text-[#aaa] hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveKey}
                disabled={!keyInput.trim()}
                className="bg-[#00d4ff] text-black font-bold px-3 py-1.5 rounded-sm disabled:opacity-40"
              >
                Guardar y conectar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aviso de fallo de red al cargar límites de países */}
      {borderError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[rgba(10,10,10,0.95)] border border-[#ff3333] text-[#ff3333] px-4 py-2 rounded-sm text-xs z-20 animate-fade-in">
          ⚠ No se pudieron cargar los límites de países. Verifica tu conexión.
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-44 left-5 bg-[rgba(10,10,10,0.95)] border border-[#333] p-4 rounded-sm text-xs z-10">
        <div className="panel-title mb-2">Elementos del Mapa</div>
        <div className="space-y-2 text-[#aaa]">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#0a0a0a]" />
            Océanos
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#4a4a4a] border border-[#ff8c42]" />
            Continentes
          </div>
          <div className="border-t border-[#333] mt-2 pt-2">
            <div className="text-[#ff8c42] font-bold mb-1">Zonas Críticas</div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-2 border-[#ff3333] bg-[rgba(255,51,51,0.1)]" />
              Crítico
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-2 border-[#ff6600] bg-[rgba(255,102,0,0.1)]" />
              Alto
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-2 border-[#ffaa00] bg-[rgba(255,170,0,0.1)]" />
              Medio
            </div>
          </div>
          <div className="border-t border-[#333] mt-2 pt-2">
            <div className="text-[#00d4ff] font-bold mb-1">Tráfico Marítimo</div>
            <div className="flex gap-2 items-center">
              <span style={{ color: '#00d4ff' }}>▲</span>
              Buque en tránsito
            </div>
            <div className="flex gap-2 items-center">
              <span style={{ color: '#ff3333' }}>▲</span>
              Buque detenido (&lt;3 nudos)
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="absolute bottom-5 left-5 flex flex-col gap-2 z-10">
        <button id="zoomIn" className="control-btn" title="Zoom In">+</button>
        <button id="zoomOut" className="control-btn" title="Zoom Out">−</button>
        <button id="resetView" className="control-btn" title="Restablecer vista">⟲</button>
      </div>

      {/* Coordenadas */}
      <div className="absolute bottom-5 right-5 bg-[rgba(10,10,10,0.95)] border border-[#333] p-3 rounded-sm text-xs font-mono text-[#ff8c42]">
        <div>Lat: {coords.lat}</div>
        <div>Lon: {coords.lon}</div>
      </div>
    </div>
  )
}
