import { useState, useEffect } from 'react'

export function useAutoScale(designWidth = 1600, designHeight = 880) {
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function calculateScale() {
      const vw = window.innerWidth
      const vh = window.innerHeight

      if (vw < 900) {
        setIsMobile(true)
        setScale(1)
        return
      }

      setIsMobile(false)

      const availableHeight = vh - 56 // navbar height
      const scaleX = vw / designWidth
      const scaleY = availableHeight / designHeight
      const newScale = Math.min(scaleX, scaleY)

      setScale(newScale)
    }

    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [designWidth, designHeight])

  return { scale, isMobile }
}