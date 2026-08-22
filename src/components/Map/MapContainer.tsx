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
  const onCountrySelectRef = useRef<(countryId: string) => void>(onCountrySelect)

  // Actualizar ref cuando el prop cambia
  useEffect(() => {
    onCountrySelectRef.current = onCountrySelect
  }, [onCountrySelect])

  useEffect(() => {
    // Cargar datos de cuellos de botella
    fetch('/data/cuellos_botella.json')
      .then((res) => res.json())
      .then((data) => setBottlenecks(data))
      .catch((err) => console.error('Error loading bottlenecks:', err))
  }, [])

  useEffect(() => {
    if (!mapRef.current) {
      // Inicializar mapa
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

      // Capa base oscura (CartoDB Dark)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        maxZoom: 19,
      }).addTo(map)

      // Agregar gridlines
      addGridlines(map)

      // Cargar datos geográficos
      fetch(
        'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
      )
        .then((res) => res.json())
        .then((data) => {
          const geoJsonLayer = L.geoJSON(data, {
            style: {
              color: '#ff8c42', // Naranja (no azul)
              weight: 1.5,
              opacity: 0.6,
              fillColor: '#0a0a0a', // Continentes negros
              fillOpacity: 0.95,
            },
            onEachFeature: ((feature: any, layer: any) => {
              const countryName = feature.properties.ADMIN || 'País'
              const countryCode = feature.properties.ISO_A2 || ''

              // Configurar eventos ANTES de añadir al mapa
              layer.on('click', () => {
                (onCountrySelectRef.current as any)(countryCode)
                // Resaltar
                (layer as any).setStyle({
                  color: '#ff8c42',
                  weight: 2.5,
                  opacity: 1,
                  fillOpacity: 1,
                })
              })

              layer.on('mouseover', () => {
                (layer as any).setStyle({
                  color: '#ff8c42',
                  weight: 2,
                  opacity: 1,
                })
                // Mostrar tooltip con el nombre del país
                if (!layer.getTooltip()) {
                  layer.bindTooltip(countryName, {
                    permanent: false,
                    direction: 'top',
                    className: 'country-tooltip'
                  })
                }
                layer.openTooltip()
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

              // Popup info
              layer.bindPopup(`
                <div style="background: #0a0a0a; color: #fff; padding: 10px; border: 1px solid #ff8c42; font-size: 12px;">
                  <strong style="color: #ff8c42;">${countryName}</strong><br>
                  <span style="color: #aaa;">Haz clic para ver empresas</span>
                </div>
              `)
            }) as any,
          })

          // Añadir la capa geográfica al mapa DESPUÉS de configurar eventos
          geoJsonLayer.addTo(map)

          // Asegurar que la capa de países tenga mejor z-index que otros elementos
          const geoJsonPane = map.createPane('geoJsonPane')
          if (geoJsonPane) {
            geoJsonPane.style.zIndex = '200'
          }
        })

      mapRef.current = map

      // Mouse move para mostrar coordenadas
      map.on('mousemove', (e) => {
        setCoords({
          lat: parseFloat(e.latlng.lat.toFixed(4)),
          lon: parseFloat(e.latlng.lng.toFixed(4)),
        })
      })
    }

    // Agregar botones de control
    const mapElement = document.getElementById('map')
    if (mapElement) {
      // Botón zoom in
      const zoomInBtn = document.getElementById('zoomIn')
      if (zoomInBtn && mapRef.current) {
        zoomInBtn.addEventListener('click', () => mapRef.current?.zoomIn())
      }

      // Botón zoom out
      const zoomOutBtn = document.getElementById('zoomOut')
      if (zoomOutBtn && mapRef.current) {
        zoomOutBtn.addEventListener('click', () => mapRef.current?.zoomOut())
      }

      // Botón reset
      const resetBtn = document.getElementById('resetView')
      if (resetBtn && mapRef.current) {
        resetBtn.addEventListener('click', () => mapRef.current?.setView([20, 0], 2))
      }
    }
  }, [selectedCountry])

  function addGridlines(map: L.Map) {
    const gridColor = '#1a2a3a'
    const gridOpacity = 0.3

    // Líneas de latitud
    for (let lat = -80; lat <= 80; lat += 20) {
      L.polyline(
        [
          [lat, -180],
          [lat, 180],
        ],
        {
          color: gridColor,
          weight: 1,
          opacity: gridOpacity,
          dashArray: '3, 3',
          interactive: false,
        }
      ).addTo(map)
    }

    // Líneas de longitud
    for (let lon = -180; lon <= 180; lon += 30) {
      L.polyline(
        [
          [-80, lon],
          [80, lon],
        ],
        {
          color: gridColor,
          weight: 1,
          opacity: gridOpacity,
          dashArray: '3, 3',
          interactive: false,
        }
      ).addTo(map)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Mapa Leaflet */}
      <div id="map" className="w-full h-full" />

      {/* Capa de Cuellos de Botella */}
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
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 border-2 border-[#ff8c42]" />
            Líneas Costeras
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
        <button id="zoomIn" className="control-btn" title="Zoom In">
          +
        </button>
        <button id="zoomOut" className="control-btn" title="Zoom Out">
          −
        </button>
        <button id="resetView" className="control-btn" title="Reset View">
          ⌘
        </button>
      </div>

      {/* Coordenadas */}
      <div className="absolute bottom-5 right-5 bg-[rgba(10,10,10,0.95)] border border-[#333] p-3 rounded-sm text-xs font-mono text-[#ff8c42]">
        <div>Lat: {coords.lat}</div>
        <div>Lon: {coords.lon}</div>
      </div>
    </div>
  )
}
