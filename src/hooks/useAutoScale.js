import { useState, useEffect, useRef } from 'react'

export function useAutoScale(designWidth = 1920, designHeight = 1000) {
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  useEffect(() => {
    function calculateScale() {
      const vw = window.innerWidth
      const vh = window.innerHeight

      // Don't scale on mobile - let it stack naturally
      if (vw < 900) {
        setScale(1)
        return
      }

      const scaleX = vw / designWidth
      const scaleY = vh / designHeight
      const newScale = Math.min(scaleX, scaleY, 1.15)
      setScale(Math.max(newScale, 0.55))
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [designWidth, designHeight])

  return { scale, containerRef }
}