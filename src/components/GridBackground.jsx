import { useEffect, useRef } from 'react'
import { useTheme } from '../lib/ThemeContext'

export default function GridBackground() {
  const { theme, isDark } = useTheme()
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrame

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function handleMouseMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const gridSize = 40
    const glowRadius = 180

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouseRef.current

      const baseColor = isDark ? '255, 255, 255' : '20, 20, 40'
      const accentColor = '124, 110, 245'

      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const dist = Math.hypot(x - mx, y - my)
          const proximity = Math.max(0, 1 - dist / glowRadius)

          if (proximity > 0.02) {
            ctx.beginPath()
            ctx.arc(x, y, 1.5 + proximity * 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${accentColor}, ${proximity * 0.6})`
            ctx.fill()
          } else {
            ctx.beginPath()
            ctx.arc(x, y, 1, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${baseColor}, 0.04)`
            ctx.fill()
          }
        }
      }

      animationFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}