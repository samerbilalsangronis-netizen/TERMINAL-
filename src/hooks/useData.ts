import { useEffect, useState } from 'react'

export function useData<T>(filename: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(`/data/${filename}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${filename}`)
        return res.json()
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [filename])

  return { data, loading, error }
}
