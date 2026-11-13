import { Link } from 'react-router'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import { listProducts } from '../../services/productService.js'
import ProductCard from '../../components/ProductCard.jsx'
import StatusMessage from '../../components/StatusMessage.jsx'

function HomePage() {
  const products = useAsyncData(listProducts)

  // Destaques: produtos disponíveis que têm etiqueta (máximo de 4)
  const featured = products.data
    ? products.data.filter((p) => p.etiqueta && p.disponivel).slice(0, 4)
    : []

  return (
    <>
      {/* O banner fica no layout (largura total). Aqui, a apresentação. */}
      <section className="intro" aria-labelledby="intro-title">
        <p className="intro__eyebrow">Campina Grande — PB</p>
        <h1 id="intro-title">Tutookie Cookies</h1>
        <p className="intro__tagline">Cookies artesanais</p>
        <div className="intro__actions">
          <Link to="/produtos" className="btn btn--small">
            Ver produtos
          </Link>
          <Link to="/promocoes" className="btn btn--secondary btn--small">
            Ver promoções
          </Link>
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
    </>
  )
}

export default HomePage