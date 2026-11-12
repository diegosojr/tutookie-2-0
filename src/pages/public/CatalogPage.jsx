import { useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import { listProducts, listCategories } from '../../services/productService.js'
import { normalizeText } from '../../utils/text.js'
import { hasActivePromotion } from '../../utils/product.js'
import ProductCard from '../../components/ProductCard.jsx'
import StatusMessage from '../../components/StatusMessage.jsx'
import Pagination from '../../components/Pagination.jsx'

const PAGE_SIZE = 8

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const products = useAsyncData(listProducts)
  const categories = useAsyncData(listCategories)
  const resultsTitleRef = useRef(null)

  // Os filtros ficam na URL: /produtos?q=...&categoria=...&promo=1&pagina=2
  const query = searchParams.get('q') ?? ''
  const categoryParam = searchParams.get('categoria') ?? ''
  const onlyPromo = searchParams.get('promo') === '1'
  const requestedPage = Number(searchParams.get('pagina')) || 1

  // Atualiza um ou mais parâmetros da URL.
  // Ao mudar um filtro, volta para a página 1.
  function updateParams(changes, { resetPage = true, replace = true } = {}) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(changes)) {
      if (value === '' || value === null) next.delete(key)
      else next.set(key, String(value))
    }
    if (resetPage) next.delete('pagina')
    setSearchParams(next, { replace })
  }

  function clearFilters() {
    setSearchParams({}, { replace: true })
  }

  function reloadAll() {
    products.reload()
    categories.reload()
  }

  function goToPage(number) {
    updateParams({ pagina: number }, { resetPage: false, replace: false })
    // Leva o foco do teclado para o início dos resultados
    resultsTitleRef.current?.focus()
  }

  const isLoading =
    products.status === 'loading' || categories.status === 'loading'
  const hasError = products.status === 'error' || categories.status === 'error'

  let content = null

  if (isLoading) {
    content = <StatusMessage type="loading" title="Carregando produtos..." />
  } else if (hasError) {
    content = (
      <StatusMessage
        type="error"
        title="Não foi possível carregar o catálogo"
        message={(products.error ?? categories.error).message}
        onRetry={reloadAll}
      />
    )
  } else {
    const allProducts = products.data
    const categoryList = categories.data

    // Se a categoria da URL não existir, ignora o filtro
    const categoryId = categoryList.some((c) => c.id === categoryParam)
      ? categoryParam
      : ''

    const searchText = normalizeText(query.trim())
    const filtered = allProducts.filter((product) => {
      const matchesText = normalizeText(
        `${product.nome} ${product.descricao}`,
      ).includes(searchText)
      const matchesCategory = !categoryId || product.categoriaId === categoryId
      const matchesPromo = !onlyPromo || hasActivePromotion(product)
      return matchesText && matchesCategory && matchesPromo
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const page = Math.min(Math.max(requestedPage, 1), totalPages)
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const hasFilters = Boolean(query || categoryId || onlyPromo)

    content = (
      <>
        <form
          className="filters"
          role="search"
          aria-label="Filtrar produtos"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="field">
            <label htmlFor="busca">Buscar produto</label>
            <input
              id="busca"
              type="search"
              value={query}
              placeholder="Ex.: chocolate"
              onChange={(event) => updateParams({ q: event.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              value={categoryId}
              onChange={(event) =>
                updateParams({ categoria: event.target.value })
              }
            >
              <option value="">Todas as categorias</option>
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="field field--check">
            <input
              id="promo"
              type="checkbox"
              checked={onlyPromo}
              onChange={(event) =>
                updateParams({ promo: event.target.checked ? '1' : '' })
              }
            />
            <label htmlFor="promo">Somente promoções</label>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          )}
        </form>

        <h2
          className="catalog__results-title"
          ref={resultsTitleRef}
          tabIndex={-1}
        >
          Resultados
        </h2>

        {allProducts.length === 0 ? (
          <StatusMessage
            type="empty"
            title="Ainda não há produtos cadastrados"
            message="Volte em breve para conhecer os sabores da Tutookie."
          />
        ) : filtered.length === 0 ? (
          <StatusMessage
            type="empty"
            title="Nenhum produto encontrado"
            message="Tente buscar por outro nome ou remover algum filtro."
            onRetry={clearFilters}
            actionLabel="Limpar filtros"
          />
        ) : (
          <>
            <p className="catalog__count" role="status">
              {filtered.length === 1
                ? '1 produto encontrado'
                : `${filtered.length} produtos encontrados`}
              {totalPages > 1 && ` — página ${page} de ${totalPages}`}
            </p>

            <ul className="grid grid--products">
              {visible.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={goToPage}
            />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <header className="page-header">
        <h1>Produtos</h1>
        <p>Busque pelo nome, escolha uma categoria ou veja só as promoções.</p>
      </header>
      {content}
    </>
  )
}

export default CatalogPage