import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import {
  getProductById,
  listCategories,
} from '../../services/productService.js'
import { formatPrice } from '../../utils/format.js'
import { hasActivePromotion, getDiscountPercent } from '../../utils/product.js'
import StatusMessage from '../../components/StatusMessage.jsx'

function ProductDetailPage() {
  // "id" vem da rota dinâmica /produto/:id
  const { id } = useParams()

  // useCallback mantém a mesma função enquanto o id não mudar
  const fetchProduct = useCallback(() => getProductById(id), [id])
  const product = useAsyncData(fetchProduct)
  const categories = useAsyncData(listCategories)

  const isLoading =
    product.status === 'loading' || categories.status === 'loading'
  const hasError = product.status === 'error' || categories.status === 'error'

  if (isLoading) {
    return <StatusMessage type="loading" title="Carregando produto..." />
  }

  if (hasError) {
    return (
      <StatusMessage
        type="error"
        title="Não foi possível carregar o produto"
        message={(product.error ?? categories.error).message}
        onRetry={() => {
          product.reload()
          categories.reload()
        }}
      />
    )
  }

  // O serviço devolve null quando o id não existe
  if (product.data === null) {
    return (
      <StatusMessage
        type="empty"
        title="Produto não encontrado"
        message="Esse produto não existe ou foi removido do catálogo."
      >
        <Link to="/produtos" className="btn">
          Ver todos os produtos
        </Link>
      </StatusMessage>
    )
  }

  const item = product.data
  const categoryName =
    categories.data.find((c) => c.id === item.categoriaId)?.nome ??
    'Sem categoria'
  const onSale = hasActivePromotion(item)

  return (
    <article className="product-detail">
      <div className="product-detail__media">
        {item.imagem ? (
          <img src={item.imagem} alt={item.nome} />
        ) : (
          <div
            className="product-detail__placeholder"
            role="img"
            aria-label={`Sem imagem cadastrada para ${item.nome}`}
          >
            Sem imagem
          </div>
        )}
      </div>

      <div className="product-detail__info">
        <p className="product-detail__category">{categoryName}</p>
        {item.etiqueta && (
          <span className="badge badge--inline">{item.etiqueta}</span>
        )}
        <h1>{item.nome}</h1>

        <p className="product-detail__price">
          {onSale ? (
            <>
              <span>
                <span className="visually-hidden">Preço promocional: </span>
                {formatPrice(item.precoPromocional)}
              </span>
              <s>
                <span className="visually-hidden">Preço original: </span>
                {formatPrice(item.preco)}
              </s>
              <span className="discount-pill">
                {getDiscountPercent(item)}% de desconto
              </span>
            </>
          ) : (
            <span>{formatPrice(item.preco)}</span>
          )}
        </p>

        <p
          className={`product-detail__availability${item.disponivel ? '' : ' product-detail__availability--no'}`}
        >
          {item.disponivel ? 'Disponível' : 'Indisponível no momento'}
        </p>

        <p>{item.descricao}</p>

        <div className="product-detail__actions">
          <Link to="/produtos" className="btn btn--secondary">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductDetailPage