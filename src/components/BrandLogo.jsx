import { useState } from 'react'
import { readSettings } from '../services/settingsService.js'

// Mostra a logomarca. Se a imagem não existir, mostra o texto.
function BrandLogo() {
  const [logo] = useState(() => readSettings().logo)
  const [failed, setFailed] = useState(false)

  if (logo && !failed) {
    return (
      <img
        className="brand-logo"
        src={logo}
        alt="Tutookie Cookies"
        onError={() => setFailed(true)}
      />
    )
  }

  return <span className="brand-text">Tutookie</span>
}

export default BrandLogo