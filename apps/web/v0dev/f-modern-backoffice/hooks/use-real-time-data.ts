"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export function useRealTimeData<T>(endpoint: string, interval = 5000) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.get<T>(endpoint)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    // Fetch inicial
    fetchData()

    // Configurar polling para datos en tiempo real
    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [endpoint, interval])

  return { data, loading, error }
}
