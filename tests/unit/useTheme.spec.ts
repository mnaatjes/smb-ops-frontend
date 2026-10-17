import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '@/shared/composables/useTheme'

describe('useTheme composable', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults and toggles theme state reactively', () => {
    const { isDark, toggleTheme, theme } = useTheme()

    const initial = isDark.value
    toggleTheme()

    expect(isDark.value).toBe(!initial)
    expect(theme.value).toBe(initial ? 'light' : 'dark')
    expect(document.documentElement.classList.contains('dark')).toBe(!initial)
    expect(localStorage.getItem('smb-ops-theme')).toBe(theme.value)
  })

  it('explicitly sets theme and synchronizes DOM root', () => {
    const { setTheme, isDark } = useTheme()

    setTheme('dark')
    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('smb-ops-theme')).toBe('dark')

    setTheme('light')
    expect(isDark.value).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('smb-ops-theme')).toBe('light')
  })
})
