import { useState, useEffect, useRef } from 'react'

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [showIdleNudge, setShowIdleNudge] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const newElapsed = Math.floor((Date.now() - startTime) / 1000)
        setElapsed(newElapsed)
        if (newElapsed > 0 && newElapsed % 7200 === 0) {
          setShowIdleNudge(true)
        }
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, startTime])

  function start() {
    const now = Date.now()
    setStartTime(now)
    setElapsed(0)
    setIsRunning(true)
    setShowIdleNudge(false)
    return new Date(now).toISOString()
  }

  function stop() {
    setIsRunning(false)
    const endTime = new Date().toISOString()
    const duration = elapsed
    setElapsed(0)
    setStartTime(null)
    setShowIdleNudge(false)
    return { endTime, duration }
  }

  function dismissNudge() {
    setShowIdleNudge(false)
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return { isRunning, elapsed, start, stop, formatTime, showIdleNudge, dismissNudge }
}