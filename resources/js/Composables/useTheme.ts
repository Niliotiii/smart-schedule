import { ref, onMounted, onUnmounted } from 'vue'

const isDark = ref(false)

let mediaQuery: MediaQueryList | null = null

function handleMediaChange(e: MediaQueryListEvent | MediaQueryList) {
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches
    document.documentElement.classList.toggle('dark', e.matches)
  }
}

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  onMounted(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }

    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleMediaChange)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', handleMediaChange)
  })

  return { isDark, toggleTheme }
}