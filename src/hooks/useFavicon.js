import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { readSettings } from '../services/settingsService.js'

// Troca o ícone da aba do navegador.
export function applyFavicon(favicon) {
  let link = document.querySelector('link[rel~="icon"]')

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.type = favicon ? 'image/png' : ''
  link.href = favicon || 'data:,'
}

// Aplica o ícone salvo nas configurações a cada mudança de rota.
export function useFavicon() {
  const { pathname } = useLocation()

  useEffect(() => {
    applyFavicon(readSettings().favicon)
  }, [pathname])
}