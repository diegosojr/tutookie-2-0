import { Link } from 'react-router'
import { formatPrice } from '../utils/format.js'

function ProductCard({ product }) {
  const promo = Number(product.precoPromocional)
  const hasPromo = promo > 0 && promo < product.preco

  return (
    <article
      className={`product-card${product.disponivel ? '' : ' product-card--unavailable'}`}
    >
      {product.etiqueta && <span className="badge">{product.etiqueta}</span>}

      <div className="product-card__media">
        {product.imagem ? (
          <img src={product.imagem} alt={product.nome} loading="lazy" />
        ) : (
          <div
            className="product-card__placeholder"
            role="img"
            aria-label={`Sem imagem cadastrada para ${product.nome}`}
          >
            Sem imagem
          </div>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__title">
          <Link className="product-card__link" to={`/produto/${product.id}`}>
            {product.nome}
          </Link>
        </h3>
        <p className="product-card__desc">{product.descricao}</p>

        <p className="product-card__price">
          {hasPromo ? (
            <>
              <s>
                <span className="visually-hidden">Preço original: </span>
                {formatPrice(product.preco)}
              </s>
              <span>
                <span className="visually-hidden">Preço promocional: </span>
                {formatPrice(promo)}
              </span>
            </>
          ) : (
            <span>{formatPrice(product.preco)}</span>
          )}
        </p>

        {!product.disponivel && (
          <p className="product-card__unavailable">Indisponível no momento</p>
        )}
      </div>
    </article>
  )
}

export default ProductCard