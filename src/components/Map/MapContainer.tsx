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
  const polylineRef = useRef<{ [key: string]: L.Polyline }>({})
  const [selectedCompanyData, setSelectedCompanyData] = useState<{
    empresa: any
    dependencias: any[]
  } | null>(null)

  // Handle company selection and draw supply chain lines
  useEffect(() => {
    const handleSelectCompany = async (event: Event) => {
      console.log('📡 MapContainer: selectCompany event received')
      const customEvent = event as CustomEvent
      const companyId = customEvent.detail

      console.log('📡 MapContainer: Company ID from event:', companyId)

      if (!mapRef.current) {
        console.warn('⚠️ MapContainer: Map not initialized yet')
        return
      }

      console.log('🔗 MapContainer: Drawing supply chain for company:', companyId)

      // Clear previous polylines
      Object.values(polylineRef.current).forEach(line => line.remove())
      polylineRef.current = {}

      try {
        const [empresasRes, dependenciasRes, paisesRes] = await Promise.all([
          fetch('/data/empresas_500.json'),
          fetch('/data/dependencias.json'),
          fetch('/data/paises.json'),
        ])

        const empresas = await empresasRes.json()
        const dependencias = await dependenciasRes.json()
        const paises = await paisesRes.json()

        // Get selected company
        const empresa = empresas.find((e: any) => e.id === companyId)
        if (!empresa) {
          console.warn('Company not found:', companyId)
          return
        }

        console.log('✅ Found company:', empresa.nombre)

        // Get dependencies (suppliers)
        const deps = dependencias.filter((d: any) => d.empresa_a === companyId)
        console.log(`📊 Found ${deps.length} suppliers for ${empresa.nombre}`)

        // Get suppliers companies and their locations
        deps.forEach((dep: any) => {
          const supplier = empresas.find((e: any) => e.id === dep.empresa_b)
          if (supplier && supplier.ubicacion_hq && empresa.ubicacion_hq) {
            // Draw polyline from main company to supplier
            const mainLat = empresa.ubicacion_hq.lat
            const mainLon = empresa.ubicacion_hq.lon
            const supplierLat = supplier.ubicacion_hq.lat
            const supplierLon = supplier.ubicacion_hq.lon

            // Create smooth arc with multiple intermediate points
            const steps = 20
            const coordinates: [number, number][] = []

            for (let i = 0; i <= steps; i++) {
              const t = i / steps
              // Interpolate position
              const lat = mainLat + (supplierLat - mainLat) * t
              const lon = mainLon + (supplierLon - mainLon) * t

              // Create parabolic arc (higher in the middle)
              const arcFactor = 4 * t * (1 - t) // Peaks at t=0.5
              const arcHeight = arcFactor * 3 // Adjust height multiplier for prominence

              coordinates.push([lat + arcHeight, lon])
            }

            const polyline = L.polyline(coordinates, {
              color: dep.es_critica ? '#ff3333' : '#ff8c42',
              weight: dep.es_critica ? 3 : 2,
              opacity: 0.7,
              dashArray: dep.es_critica ? undefined : '5, 5',
              smoothFactor: 0.5,
            }).addTo(mapRef.current)

            // Add popup on hover
            polyline.bindPopup(
              `<div style="background: #0a0a0a; color: #fff; padding: 8px; border: 1px solid #ff8c42; font-size: 11px;">
                <strong>${empresa.nombre}</strong> → <strong>${supplier.nombre}</strong><br>
                <span style="color: #aaa;">Suministro: ${dep.porcentaje_suministro.toFixed(0)}%</span><br>
                ${dep.es_critica ? '<span style="color: #ff3333;">🔴 CRÍTICA</span>' : ''}
              </div>`
            )

            polylineRef.current[dep.empresa_b] = polyline
          }
        })

        setSelectedCompanyData({ empresa, dependencias: deps })
      } catch (error) {
        console.error('Error drawing supply chain:', error)
      }
    }

    window.addEventListener('selectCompany', handleSelectCompany)
    return () => window.removeEventListener('selectCompany', handleSelectCompany)
  }, [])

  useEffect(() => {
    console.log('📍 MapContainer: onCountrySelect callback recibido:', typeof onCountrySelect)

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
              // Extract country name from multiple possible properties
              const countryName = feature.properties.ADMIN ||
                                feature.properties.name ||
                                feature.properties.NAME ||
                                feature.properties.COUNTRY ||
                                'País'

              // Log all properties to debug
              console.log(`📍 GeoJSON Feature Properties:`, feature.properties)

              // Extract country code from multiple possible properties
              let countryCode = feature.properties.ISO_A2 ||
                                feature.properties.iso_a2 ||
                                feature.properties.code ||
                                feature.properties.ISO_A3 ||
                                feature.properties.ISO_N3 ||
                                ''

              // If still empty, try to derive from country name
              if (!countryCode && countryName) {
                // Try to match country name to our paises.json
                const nameToCode: {[key: string]: string} = {
                  'United States': 'US',
                  'United States of America': 'US',
                  'USA': 'US',
                  'China': 'CN',
                  'Japan': 'JP',
                  'United Kingdom': 'GB',
                  'UK': 'GB',
                  'Germany': 'DE',
                  'South Korea': 'KR',
                  'Korea': 'KR',
                  'Taiwan': 'TW',
                  'Netherlands': 'NL',
                  'Canada': 'CA',
                  'Australia': 'AU',
                  'Iran': 'IR',
                  'France': 'FR',
                  'Italy': 'IT',
                  'Spain': 'ES',
                  'Brazil': 'BR',
                  'India': 'IN',
                  'Mexico': 'MX',
                  'Russia': 'RU',
                  'Russian Federation': 'RU',
                  'Singapore': 'SG',
                  'Sweden': 'SE',
                  'Switzerland': 'CH',
                }

                // Try exact match first
                countryCode = nameToCode[countryName]

                // If not found, try case-insensitive and partial matching
                if (!countryCode) {
                  const lowerName = countryName.toLowerCase()
                  for (const [key, code] of Object.entries(nameToCode)) {
                    if (key.toLowerCase() === lowerName) {
                      countryCode = code
                      break
                    }
                  }
                }

                console.log(`   Mapeo de nombre: ${countryName} → ${countryCode}`)
              }

              console.log(`📍 GeoJSON Feature: ${countryName} (${countryCode})`)

              // @ts-ignore
              layer.on('click', () => {
                console.log('🎯 Click en país:', countryName)
                console.log('   Código extraído:', countryCode)
                console.log('   Callback disponible:', typeof onCountrySelect)

                if (!countryCode) {
                  console.warn(`⚠️ No se extrajo código para: ${countryName}`)
                }

                if (countryCode && onCountrySelect) {
                  onCountrySelect(countryCode)
                  console.log('✅ onCountrySelect llamado para:', countryCode)
                } else {
                  console.error('❌ No se pudo obtener código de país:', countryCode, 'Callback:', typeof onCountrySelect)
                }
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
                // Tooltip con nombre del país
                const tooltip = countryName && countryName !== 'País' ? countryName : 'País'
                layer.bindTooltip(tooltip, {
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

  // Clear supply chain when country is selected
  useEffect(() => {
    if (selectedCountry) {
      Object.values(polylineRef.current).forEach(line => line.remove())
      polylineRef.current = {}
      setSelectedCompanyData(null)
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
