import { useAuth } from '../../hooks/useAuth.js'

// Página provisória: os indicadores entram na Etapa 11.
function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <section>
      <h1>Dashboard</h1>
      <p>
        Bem-vindo(a), <strong>{user.nome}</strong>. Aqui ficarão os indicadores
        da loja.
      </p>
    </section>
  )
}

export default AdminDashboardPage