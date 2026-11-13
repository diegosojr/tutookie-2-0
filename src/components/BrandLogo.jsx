import { useState } from 'react'
import { readSettings } from '../services/settingsService.js'

// Mostra a logomarca enviada pelo admin. Sem logomarca, mostra o texto.
function BrandLogo() {
  const [logo] = useState(() => readSettings().logo)

  if (logo) {
    return <img className="brand-logo" src={logo} alt="Tutookie Cookies" />
  }

  return <span className="brand-text">Tutookie</span>
}

export default BrandLogo