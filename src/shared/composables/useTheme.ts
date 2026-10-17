import { ref, computed } from 'vue'

export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'smb-ops-theme'

const currentTheme = ref<ThemeMode>(initTheme())

function initTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') {
    applyDomTheme(saved)
    return saved
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const initial = prefersDark ? 'dark' : 'light'
  applyDomTheme(initial)
  return initial
}

function applyDomTheme(theme: ThemeMode): void {
  if (typeof document === 'undefined') return
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function useTheme() {
  const isDark = computed(() => currentTheme.value === 'dark')

  function setTheme(mode: ThemeMode): void {
    currentTheme.value = mode
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    applyDomTheme(mode)
  }

  function toggleTheme(): void {
    const next = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return {
    theme: currentTheme,
    isDark,
    setTheme,
    toggleTheme
  }
}
