'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapContainerProps {
  onCountrySelect: (countryId: string) => void
  selectedCountry: string | null
}

export default function MapContainer({ onCountrySelect, selectedCountry }: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [coords, setCoords] = useState({ lat: 0, lon: 0 })
  const [borderError, setBorderError] = useState(false)
  const handleCountrySelect = onCountrySelect

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
          L.geoJSON(data, {
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

              // @ts-ignore
              layer.on('click', () => {
                // @ts-ignore
                handleCountrySelect(countryCode)
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
                // Tooltip
                layer.bindTooltip(countryName, {
                  permanent: false,
                  direction: 'top',
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

              // Popup info
              layer.bindPopup(`
                <div style="background: #0a0a0a; color: #fff; padding: 10px; border: 1px solid #ff8c42; font-size: 12px;">
                  <strong style="color: #ff8c42;">${countryName}</strong><br>
                  <span style="color: #aaa;">Haz clic para ver empresas</span>
                </div>
              `)
            }) as any,
          }).addTo(map)
        })
        .catch((error) => {
          console.error('Error cargando límites de países:', error)
          setBorderError(true)
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
  }, [onCountrySelect, selectedCountry])

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

      {/* Aviso de fallo de red al cargar límites de países */}
      {borderError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[rgba(10,10,10,0.95)] border border-[#ff3333] text-[#ff3333] px-4 py-2 rounded-sm text-xs z-20 animate-fade-in">
          ⚠ No se pudieron cargar los límites de países. Verifica tu conexión.
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute bottom-32 left-5 bg-[rgba(10,10,10,0.95)] border border-[#333] p-4 rounded-sm text-xs z-10">
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
        <button id="resetView" className="control-btn" title="Restablecer vista">
          ⟲
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
