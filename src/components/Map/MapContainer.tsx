'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const BottleneckLayer = dynamic(() => import('./BottleneckLayer'), { ssr: false })

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

  // Store callback en ref
  const callbackRef = useRef<typeof onCountrySelect>(onCountrySelect)
  useEffect(() => {
    callbackRef.current = onCountrySelect
  }, [onCountrySelect])

  // Cargar cuellos de botella
  useEffect(() => {
    fetch('/data/cuellos_botella.json')
      .then(res => res.json())
      .then(data => setBottlenecks(data))
      .catch(err => console.error('Error cargando cuellos:', err))
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
            fillColor: '#0a0a0a',
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
    const gridColor = '#1a2a3a'
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
      <div id="map" className="w-full h-full" />

      {mapRef.current && (
        <BottleneckLayer
          map={mapRef.current}
          bottlenecks={bottlenecks}
          onBottleneckSelect={(bottleneck) => {
            if (onBottleneckSelect) {
              onBottleneckSelect(bottleneck)
            }
          }}
          selectedBottleneck={selectedBottleneck || null}
        />
      )}

      {/* Leyenda */}
      <div className="absolute bottom-20 left-5 bg-[rgba(10,10,10,0.95)] border border-[#333] p-4 rounded-sm text-xs z-10">
        <div className="panel-title mb-2">Elementos del Mapa</div>
        <div className="space-y-2 text-[#aaa]">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#001a33]" />
            Océanos
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-[#0a0a0a] border border-[#ff8c42]" />
            Continentes
          </div>
          <div className="border-t border-[#333] mt-2 pt-2">
            <div className="text-[#ff8c42] font-bold mb-1">Cuellos de Botella</div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-[#ff3333] rounded-full" />
              Crítico
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-[#ff6600] rounded-full" />
              Alto
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-3 h-3 bg-[#ffaa00] rounded-full" />
              Medio
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="absolute bottom-5 left-5 flex flex-col gap-2 z-10">
        <button id="zoomIn" className="control-btn" title="Zoom In">+</button>
        <button id="zoomOut" className="control-btn" title="Zoom Out">−</button>
        <button id="resetView" className="control-btn" title="Reset View">⌘</button>
      </div>

      {/* Coordenadas */}
      <div className="absolute bottom-5 right-5 bg-[rgba(10,10,10,0.95)] border border-[#333] p-3 rounded-sm text-xs font-mono text-[#ff8c42]">
        <div>Lat: {coords.lat}</div>
        <div>Lon: {coords.lon}</div>
      </div>
    </div>
  )
}
