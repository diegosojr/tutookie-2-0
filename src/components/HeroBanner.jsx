import { useState } from 'react'

// Banner da página inicial. Se não houver imagem (ou ela não carregar),
// mostra um espaço reservado.
function HeroBanner({ src }) {
  const [failedSrc, setFailedSrc] = useState('')

  if (src && failedSrc !== src) {
    return (
      <div className="hero__banner">
        <img
          src={src}
          alt="Banner promocional da Tutookie"
          onError={() => setFailedSrc(src)}
        />
      </div>
    )
  }

  return (
    <div className="hero__banner">
      <div className="hero__banner-placeholder">
        <p>
          <strong>Espaço do banner promocional</strong>
        </p>
        <p>A imagem será enviada pelo painel administrativo.</p>
      </div>
    </div>
  )
}

export default HeroBanner