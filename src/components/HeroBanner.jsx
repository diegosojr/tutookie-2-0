import { useState } from 'react'

// Banner da página inicial, de uma ponta à outra da tela.
// Se não houver imagem (ou ela não carregar), mostra um espaço reservado.
function HeroBanner({ src }) {
  const [failedSrc, setFailedSrc] = useState('')

  if (src && failedSrc !== src) {
    return (
      <div className="home-banner">
        <img
          src={src}
          alt="Banner promocional da Tutookie"
          onError={() => setFailedSrc(src)}
        />
      </div>
    )
  }

  return (
    <div className="home-banner">
      <div className="home-banner__placeholder">
        <p>
          <strong>Espaço do banner promocional</strong>
        </p>
        <p>A imagem será enviada pelo painel administrativo.</p>
      </div>
    </div>
  )
}

export default HeroBanner