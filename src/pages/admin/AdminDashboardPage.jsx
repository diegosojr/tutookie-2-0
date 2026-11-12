import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import { useAsyncData } from '../../hooks/useAsyncData.js'
import {
  listProducts,
  listCategories,
  getDemoFlags,
  setDemoFlag,
} from '../../services/productService.js'
import { hasActivePromotion } from '../../utils/product.js'
import StatusMessage from '../../components/StatusMessage.jsx'

// Caixinhas para simular erro e lista vazia na apresentação.
function DemoTools() {
  const [flags, setFlags] = useState(() => getDemoFlags())

  function toggle(name, value) {
    setDemoFlag(name, value)
    setFlags(getDemoFlags())
  }

  return (
    <section className="admin-card" aria-labelledby="demo-title">
      <h2 id="demo-title">Ferramentas de demonstração</h2>
      <p>
        Use na apresentação para mostrar os estados de erro e de lista vazia. A
        alteração vale na próxima vez que os dados forem carregados (recarregue
        a página ou use &quot;Tentar novamente&quot;).
      </p>

      <div className="field field--check">
        <input
          id="demo-error"
          type="checkbox"
          checked={flags.error}
          onChange={(event) => toggle('error', event.target.checked)}
        />
        <label htmlFor="demo-error">Simular erro de carregamento</label>
      </div>

      <div className="field field--check">
        <input
          id="demo-empty"
          type="checkbox"
          checked={flags.empty}
          onChange={(event) => toggle('empty', event.target.checked)}
        />
        <label htmlFor="demo-empty">Simular lista de produtos vazia</label>
      </div>
    </section>
  )
}

function AdminDashboardPage() {
  const { user } = useAuth()
  const products = useAsyncData(listProducts)
  const categories = useAsyncData(listCategories)

  const isLoading =
    products.status === 'loading' || categories.status === 'loading'
  const hasError = products.status === 'error' || categories.status === 'error'

  let stats = null

  if (isLoading) {
    stats = <StatusMessage type="loading" title="Carregando indicadores..." />
  } else if (hasError) {
    stats = (
      <StatusMessage
        type="error"
        title="Não foi possível carregar os indicadores"
        message={(products.error ?? categories.error).message}
        onRetry={() => {
          products.reload()
          categories.reload()
        }}
      />
    )
  } else {
    const items = [
      { label: 'Total de produtos', value: products.data.length },
      {
        label: 'Produtos disponíveis',
        value: products.data.filter((p) => p.disponivel).length,
      },
      {
        label: 'Produtos em promoção',
        value: products.data.filter(hasActivePromotion).length,
      },
      { label: 'Total de categorias', value: categories.data.length },
    ]

    stats = (
      <ul className="stats">
        {items.map((item) => (
          <li key={item.label} className="stat">
            <span className="stat__value">{item.value}</span>
            <span className="stat__label">{item.label}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <h1>Dashboard</h1>
      <p>
        Bem-vindo(a), <strong>{user.nome}</strong>. Estes indicadores vêm dos
        dados cadastrados na loja.
      </p>

      {stats}

      <div className="admin__shortcuts">
        <Link to="/admin/produtos" className="btn">
          Gerenciar produtos
        </Link>
        <Link to="/admin/produtos/novo" className="btn btn--secondary">
          Cadastrar produto
        </Link>
      </div>

      <DemoTools />
    </>
  )
}

export default AdminDashboardPage