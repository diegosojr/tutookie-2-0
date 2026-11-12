import { Link } from 'react-router'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import { listProducts } from '../../services/productService.js'
import { hasActivePromotion } from '../../utils/product.js'
import ProductCard from '../../components/ProductCard.jsx'
import StatusMessage from '../../components/StatusMessage.jsx'

function PromotionsPage() {
  const products = useAsyncData(listProducts)

  // Promoções: produtos com desconto ativo e disponíveis
  const promotions = products.data
    ? products.data.filter((p) => hasActivePromotion(p) && p.disponivel)
    : []

  return (
    <>
      <header className="page-header">
        <h1>Promoções</h1>
        <p>Produtos com desconto ativo na Tutookie.</p>
      </header>

      {products.status === 'loading' && (
        <StatusMessage type="loading" title="Carregando promoções..." />
      )}

      {products.status === 'error' && (
        <StatusMessage
          type="error"
          title="Não foi possível carregar as promoções"
          message={products.error.message}
          onRetry={products.reload}
        />
      )}

      {products.status === 'success' && promotions.length === 0 && (
        <StatusMessage
          type="empty"
          title="Nenhuma promoção ativa no momento"
          message="Volte em breve ou confira o catálogo completo."
        >
          <Link to="/produtos" className="btn">
            Ver todos os produtos
          </Link>
        </StatusMessage>
      )}

      {products.status === 'success' && promotions.length > 0 && (
        <ul className="grid grid--products">
          {promotions.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default PromotionsPage