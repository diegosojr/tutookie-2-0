import { useState } from 'react'
import { readSettings } from '../services/settingsService.js'

function Footer() {
  const [logo] = useState(() => readSettings().logo)

  return (
    <footer className="site-footer">
      <div className="container">
        {logo ? (
          <div className="site-footer__logo">
            <img src={logo} alt="Tutookie Cookies" />
          </div>
        ) : (
          <p className="site-footer__brand">Tutookie Cookies</p>
        )}
        <p>Campina Grande — PB</p>
        <p>
          Projeto acadêmico Tutookie 2.0 (Fase 1). Imagens, preços e dados
          exibidos são demonstrativos.
        </p>
      </div>
    </footer>
  )
}

export default Footer