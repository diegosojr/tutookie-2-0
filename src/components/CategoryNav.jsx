import { Link, useLocation, useSearchParams } from 'react-router'
import { useAsyncData } from '../hooks/useAsyncData.js'
import { listCategories } from '../services/productService.js'

// Barra de categorias (abaixo do menu principal, em todas as páginas da loja).
function CategoryNav() {
  const categories = useAsyncData(listCategories)
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()

  // Enquanto carrega, reserva o espaço para a página não "pular"
  if (categories.status === 'loading') {
    return <div className="category-nav category-nav--loading" aria-hidden="true" />
  }

  // Se der erro, a barra simplesmente não aparece (as páginas mostram o erro)
  if (categories.status === 'error') return null

  const onCatalog = pathname === '/produtos'
  const current = searchParams.get('categoria') ?? ''

  const items = [
    { id: '', nome: 'Todos', to: '/produtos' },
    ...categories.data.map((category) => ({
      id: category.id,
      nome: category.nome,
      to: `/produtos?categoria=${category.id}`,
    })),
  ]

  return (
    <nav className="category-nav" aria-label="Categorias de produtos">
      <div className="container">
        <ul className="category-nav__list">
          {items.map((item) => {
            const active = onCatalog && current === item.id

            return (
              <li key={item.id || 'todos'}>
                <Link
                  to={item.to}
                  className={`category-nav__link${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.nome}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default CategoryNav