import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section>
      <h1>Página não encontrada</h1>
      <p>O endereço que você acessou não existe.</p>
      <Link to="/">Voltar para o início</Link>
    </section>
  )
}

export default NotFoundPage