window.toggleTheme = function () {
  const html = document.documentElement
  const isDark = html.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  updateThemeIcon()
}

function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains('dark')
  const sunIcon = document.getElementById('theme-icon-sun')
  const moonIcon = document.getElementById('theme-icon-moon')
  if (sunIcon && moonIcon) {
    sunIcon.classList.toggle('hidden', !isDark)
    moonIcon.classList.toggle('hidden', isDark)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcon()
})