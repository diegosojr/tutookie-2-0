import { Link } from 'react-router'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import { listProducts, listCategories } from '../../services/productService.js'
import { getSettings } from '../../services/settingsService.js'
import ProductCard from '../../components/ProductCard.jsx'
import StatusMessage from '../../components/StatusMessage.jsx'

function HomePage() {
  const products = useAsyncData(listProducts)
  const categories = useAsyncData(listCategories)
  const settings = useAsyncData(getSettings)

  const banner = settings.data?.banner

  // Destaques: produtos disponíveis que têm etiqueta (máximo de 4)
  const featured = products.data
    ? products.data.filter((p) => p.etiqueta && p.disponivel).slice(0, 4)
    : []

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__text">
          <p className="hero__eyebrow">Campina Grande — PB</p>
          <h1 id="hero-title">Tutookie Cookies</h1>
          <p>
            Cookies artesanais de Campina Grande, na Paraíba. Conheça os
            sabores da casa.
          </p>
          <div className="hero__actions">
            <Link to="/produtos" className="btn">
              Ver produtos
            </Link>
            <Link to="/promocoes" className="btn btn--secondary">
              Ver promoções
            </Link>
          </div>
        </div>

        <div className="hero__banner">
          {banner ? (
            <img src={banner} alt="Banner promocional da Tutookie" />
          ) : (
            <div className="hero__banner-placeholder">
              <p>
                <strong>Espaço do banner promocional</strong>
              </p>
              <p>A imagem será enviada pelo painel administrativo.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="destaques-title">
        <div className="section__header">
          <h2 id="destaques-title">Destaques</h2>
          <Link to="/produtos">Ver todos</Link>
        </div>

        {products.status === 'loading' && (
          <StatusMessage type="loading" title="Carregando produtos..." />
        )}

        {products.status === 'error' && (
          <StatusMessage
            type="error"
            title="Não foi possível carregar os produtos"
            message={products.error.message}
            onRetry={products.reload}
          />
        )}

        {products.status === 'success' && featured.length === 0 && (
          <StatusMessage
            type="empty"
            title="Nenhum destaque no momento"
            message="Volte em breve para conhecer as novidades."
          />
        )}

        {products.status === 'success' && featured.length > 0 && (
          <ul className="grid grid--products">
            {featured.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section" aria-labelledby="categorias-title">
        <div className="section__header">
          <h2 id="categorias-title">Categorias</h2>
        </div>

        {categories.status === 'loading' && (
          <StatusMessage type="loading" title="Carregando categorias..." />
        )}

        {categories.status === 'error' && (
          <StatusMessage
            type="error"
            title="Não foi possível carregar as categorias"
            message={categories.error.message}
            onRetry={categories.reload}
          />
        )}

        {categories.status === 'success' && (
          <ul className="grid grid--categories">
            {categories.data.map((category) => (
              <li key={category.id}>
                <Link
                  className="category-card"
                  to={`/produtos?categoria=${category.id}`}
                >
                  <span className="category-card__name">{category.nome}</span>
                  <span className="category-card__desc">
                    {category.descricao}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default HomePage