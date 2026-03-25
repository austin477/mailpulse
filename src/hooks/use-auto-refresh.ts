'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface UseAutoRefreshOptions {
  interval?: number // ms, default 30000
  enabled?: boolean
  onRefresh: () => Promise<void>
}

export function useAutoRefresh({ interval = 30000, enabled = true, onRefresh }: UseAutoRefreshOptions) {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onRefreshRef = useRef(onRefresh)

  // Keep ref updated
  useEffect(() => {
    onRefreshRef.current = onRefresh
  }, [onRefresh])

  const refresh = useCallback(async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      await onRefreshRef.current()
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Auto-refresh error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing])

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      refresh()
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, interval, refresh])

  return { lastRefresh, isRefreshing, refresh }
}
