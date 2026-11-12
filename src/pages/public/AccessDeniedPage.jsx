import { Link } from 'react-router'

function AccessDeniedPage() {
  return (
    <section className="auth-card">
      <h1>Acesso negado</h1>
      <p>
        Esta área é exclusiva para administradores. Entre com uma conta de
        administrador para acessá-la.
      </p>
      <div className="auth-card__actions">
        <Link to="/" className="btn">
          Voltar para o início
        </Link>
        <Link to="/login" className="btn btn--secondary">
          Ir para minha conta
        </Link>
      </div>
    </section>
  )
}

export default AccessDeniedPage