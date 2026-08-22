'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'

// Cajas delimitadoras de los cuellos de botella marítimos ya mapeados en
// cuellos_botella.json. Se mantienen ajustadas (no globales) para no saturar
// la conexión gratuita de AISStream con miles de buques a la vez.
const CHOKEPOINTS: { id: string; nombre: string; box: [[number, number], [number, number]] }[] = [
  { id: 'ormuz-petroleo', nombre: 'Estrecho de Ormuz', box: [[25.5, 55.8], [27.0, 57.0]] },
  { id: 'estrecho-malaca', nombre: 'Estrecho de Malaca', box: [[1.0, 97.5], [6.5, 104.5]] },
  { id: 'singapur-refineria', nombre: 'Estrecho de Singapur', box: [[1.05, 103.4], [1.5, 104.2]] },
  { id: 'panama-canal', nombre: 'Canal de Panamá', box: [[8.85, -80.1], [9.4, -79.4]] },
]

const STALE_MS = 15 * 60 * 1000 // eliminar buques sin señal en 15 min
const RECONNECT_DELAY_MS = 5000

export type VesselStatus = 'idle' | 'connecting' | 'connected' | 'error'

interface VesselLayerProps {
  map: L.Map | null
  apiKey: string | null
  enabled: boolean
  onStatusChange?: (status: VesselStatus, vesselCount: number) => void
}

interface TrackedVessel {
  marker: L.Marker
  lastSeen: number
}

function vesselIcon(heading: number, critica: boolean): L.DivIcon {
  const color = critica ? '#ff3333' : '#00d4ff'
  return L.divIcon({
    className: 'vessel-icon',
    html: `<div style="transform: rotate(${heading}deg); width: 14px; height: 14px;">
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path d="M12 1 L20 20 L12 16 L4 20 Z" fill="${color}" stroke="#0a0a0a" stroke-width="1.5"/>
      </svg>
    </div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export default function VesselLayer({ map, apiKey, enabled, onStatusChange }: VesselLayerProps) {
  const wsRef = useRef<WebSocket | null>(null)
  const vesselsRef = useRef<Map<number, TrackedVessel>>(new Map())
  const paneRef = useRef<L.LayerGroup | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cleanupTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const closedIntentionally = useRef(false)

  useEffect(() => {
    if (!map) return

    if (!map.getPane('vesselPane')) {
      const pane = map.createPane('vesselPane')
      pane.style.zIndex = '10000'
      pane.style.pointerEvents = 'auto'
    }
    if (!paneRef.current) {
      paneRef.current = L.layerGroup().addTo(map)
    }

    if (!enabled || !apiKey) {
      // Apagar: cerrar socket y limpiar buques del mapa
      closedIntentionally.current = true
      wsRef.current?.close()
      wsRef.current = null
      vesselsRef.current.forEach((v) => paneRef.current?.removeLayer(v.marker))
      vesselsRef.current.clear()
      onStatusChange?.('idle', 0)
      return
    }

    closedIntentionally.current = false

    const connect = () => {
      onStatusChange?.('connecting', vesselsRef.current.size)
      const ws = new WebSocket('wss://stream.aisstream.io/v0/stream')
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(JSON.stringify({
          APIKey: apiKey,
          BoundingBoxes: CHOKEPOINTS.map((c) => c.box),
          FilterMessageTypes: ['PositionReport'],
        }))
        onStatusChange?.('connected', vesselsRef.current.size)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.MessageType !== 'PositionReport') return

          const mmsi: number = data.MetaData?.MMSI
          const lat: number = data.MetaData?.Latitude
          const lon: number = data.MetaData?.Longitude
          const nombre: string = (data.MetaData?.ShipName || `MMSI ${mmsi}`).trim()
          const report = data.Message?.PositionReport || {}
          const sog: number = report.Sog ?? 0
          const heading: number = (report.TrueHeading !== undefined && report.TrueHeading < 360)
            ? report.TrueHeading
            : (report.Cog ?? 0)

          if (mmsi === undefined || lat === undefined || lon === undefined) return

          // Sin ShipType en PositionReport: se resalta en rojo la navegación
          // lenta (<3 nudos), típica de buques fondeados/cargando en un
          // cuello de botella crítico; el resto en cian.
          const critica = sog < 3
          const icon = vesselIcon(heading, critica)

          const existing = vesselsRef.current.get(mmsi)
          if (existing) {
            existing.marker.setLatLng([lat, lon])
            existing.marker.setIcon(icon)
            existing.lastSeen = Date.now()
          } else {
            const marker = L.marker([lat, lon], { icon, pane: 'vesselPane' })
            marker.bindTooltip(
              `${nombre}<br/>MMSI ${mmsi} · ${sog.toFixed(1)} nudos`,
              { direction: 'top', className: 'vessel-tooltip' }
            )
            marker.addTo(paneRef.current!)
            vesselsRef.current.set(mmsi, { marker, lastSeen: Date.now() })
          }

          onStatusChange?.('connected', vesselsRef.current.size)
        } catch {
          // Ignorar mensajes que no se puedan parsear
        }
      }

      ws.onerror = () => {
        onStatusChange?.('error', vesselsRef.current.size)
      }

      ws.onclose = () => {
        if (closedIntentionally.current) return
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS)
      }
    }

    connect()

    // Limpiar buques que dejaron de reportar posición
    cleanupTimer.current = setInterval(() => {
      const now = Date.now()
      vesselsRef.current.forEach((v, mmsi) => {
        if (now - v.lastSeen > STALE_MS) {
          paneRef.current?.removeLayer(v.marker)
          vesselsRef.current.delete(mmsi)
        }
      })
      onStatusChange?.('connected', vesselsRef.current.size)
    }, 60 * 1000)

    return () => {
      closedIntentionally.current = true
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      if (cleanupTimer.current) clearInterval(cleanupTimer.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [map, apiKey, enabled, onStatusChange])

  return null
}
