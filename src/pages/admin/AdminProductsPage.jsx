import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import {
  listProducts,
  listCategories,
  deleteProduct,
} from '../../services/productService.js'
import { formatPrice } from '../../utils/format.js'
import { normalizeText } from '../../utils/text.js'
import { hasActivePromotion } from '../../utils/product.js'
import StatusMessage from '../../components/StatusMessage.jsx'
import Pagination from '../../components/Pagination.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'

const PAGE_SIZE = 6
const NO_FILTERS = { q: '', categoria: '', disponibilidade: '' }

function AdminProductsPage() {
  const location = useLocation()
  const products = useAsyncData(listProducts)
  const categories = useAsyncData(listCategories)

  const [filters, setFilters] = useState(NO_FILTERS)
  const [page, setPage] = useState(1)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState(() => location.state?.feedback ?? null)
  function changeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(NO_FILTERS)
    setPage(1)
  }

  async function confirmDelete() {
    setDeleting(true)
    try {
      await deleteProduct(toDelete.id)
      setFeedback({
        type: 'success',
        text: `Produto "${toDelete.nome}" excluído.`,
      })
      products.reload()
    } catch (error) {
      setFeedback({ type: 'error', text: error.message })
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  const isLoading =
    products.status === 'loading' || categories.status === 'loading'
  const hasError = products.status === 'error' || categories.status === 'error'

  let content

  if (isLoading) {
    content = <StatusMessage type="loading" title="Carregando produtos..." />
  } else if (hasError) {
    content = (
      <StatusMessage
        type="error"
        title="Não foi possível carregar os produtos"
        message={(products.error ?? categories.error).message}
        onRetry={() => {
          products.reload()
          categories.reload()
        }}
      />
    )
  } else {
    const allProducts = products.data
    const categoryNames = Object.fromEntries(
      categories.data.map((category) => [category.id, category.nome]),
    )

    const searchText = normalizeText(filters.q.trim())
    const filtered = allProducts.filter((product) => {
      const matchesText = normalizeText(product.nome).includes(searchText)
      const matchesCategory =
        !filters.categoria || product.categoriaId === filters.categoria
      const matchesAvailability =
        !filters.disponibilidade ||
        (filters.disponibilidade === 'sim'
          ? product.disponivel
          : !product.disponivel)
      return matchesText && matchesCategory && matchesAvailability
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const visible = filtered.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    )
    const hasFilters = Boolean(
      filters.q || filters.categoria || filters.disponibilidade,
    )

    content = (
      <>
        {allProducts.length > 0 && (
          <form
            className="filters"
            role="search"
            aria-label="Filtrar produtos do painel"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="field">
              <label htmlFor="admin-busca">Buscar pelo nome</label>
              <input
                id="admin-busca"
                type="search"
                value={filters.q}
                onChange={(event) => changeFilter('q', event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="admin-categoria">Categoria</label>
              <select
                id="admin-categoria"
                value={filters.categoria}
                onChange={(event) =>
                  changeFilter('categoria', event.target.value)
                }
              >
                <option value="">Todas</option>
                {categories.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="admin-disponibilidade">Disponibilidade</label>
              <select
                id="admin-disponibilidade"
                value={filters.disponibilidade}
                onChange={(event) =>
                  changeFilter('disponibilidade', event.target.value)
                }
              >
                <option value="">Todas</option>
                <option value="sim">Disponíveis</option>
                <option value="nao">Indisponíveis</option>
              </select>
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
        )}

        {allProducts.length === 0 ? (
          <StatusMessage
            type="empty"
            title="Nenhum produto cadastrado"
            message="Cadastre o primeiro produto da loja."
          >
            <Link to="/admin/produtos/novo" className="btn">
              Cadastrar produto
            </Link>
          </StatusMessage>
        ) : filtered.length === 0 ? (
          <StatusMessage
            type="empty"
            title="Nenhum produto encontrado"
            message="Tente outro nome ou remova algum filtro."
            onRetry={clearFilters}
            actionLabel="Limpar filtros"
          />
        ) : (
          <>
            <p className="catalog__count" role="status">
              {filtered.length === 1
                ? '1 produto'
                : `${filtered.length} produtos`}
              {totalPages > 1 && ` — página ${currentPage} de ${totalPages}`}
            </p>

            <div
              className="table-wrap"
              role="region"
              aria-label="Tabela de produtos (use as setas para rolar para o lado, se necessário)"
              tabIndex={0}
            >
              <table className="admin-table">
                <caption className="visually-hidden">
                  Lista de produtos cadastrados
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Imagem</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Promoção</th>
                    <th scope="col">Disponibilidade</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((product) => (
                    <tr key={product.id}>
                      <td>
                        {product.imagem ? (
                          <img
                            className="admin-table__thumb"
                            src={product.imagem}
                            alt=""
                          />
                        ) : (
                          <span
                            className="admin-table__thumb admin-table__thumb--empty"
                            aria-hidden="true"
                          >
                            —
                          </span>
                        )}
                      </td>
                      <th scope="row" className="admin-table__name">
                        {product.nome}
                      </th>
                      <td>
                        {categoryNames[product.categoriaId] ?? 'Sem categoria'}
                      </td>
                      <td>{formatPrice(product.preco)}</td>
                      <td>
                        {hasActivePromotion(product)
                          ? formatPrice(product.precoPromocional)
                          : '—'}
                      </td>
                      <td>
                        <span
                          className={`status-tag ${product.disponivel ? 'status-tag--yes' : 'status-tag--no'}`}
                        >
                          {product.disponivel ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <Link
                            to={`/admin/produtos/${product.id}/editar`}
                            className="btn btn--secondary btn--small"
                            aria-label={`Editar ${product.nome}`}
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            className="btn btn--danger btn--small"
                            aria-label={`Excluir ${product.nome}`}
                            onClick={() => {
                              setFeedback(null)
                              setToDelete(product)
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </>
    )
  }

  return (
    <>
      <div className="page-actions">
        <h1>Produtos</h1>
        <Link to="/admin/produtos/novo" className="btn">
          Novo produto
        </Link>
      </div>

      {feedback && (
        <p
          className={`form-alert${feedback.type === 'success' ? ' form-alert--success' : ''}`}
          role={feedback.type === 'success' ? 'status' : 'alert'}
        >
          {feedback.text}
        </p>
      )}

      {content}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir produto?"
        message={
          toDelete
            ? `Tem certeza de que deseja excluir "${toDelete.nome}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Sim, excluir"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}

export default AdminProductsPage