import { createContext, useContext, useState } from 'react'
import { darkTheme, lightTheme } from './theme'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const theme = isDark ? darkTheme : lightTheme

  function toggleTheme() {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      <div style={{
        background: theme.bg,
        color: theme.text,
        minHeight: '100vh',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}