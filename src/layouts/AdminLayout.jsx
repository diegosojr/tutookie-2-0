import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="admin">
      <a className="skip-link" href="#conteudo-admin">
        Pular para o conteúdo
      </a>

      <header className="admin__bar">
        <div className="container admin__bar-inner">
          <p className="admin__title">Tutookie · Painel administrativo</p>

          <nav aria-label="Navegação do painel">
            <ul className="admin__nav">
              <li>
                <NavLink to="/admin" end>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <Link to="/">Ver loja</Link>
              </li>
            </ul>
          </nav>

          <div className="admin__user">
            <span>{user.nome}</span>
            <button
              type="button"
              className="btn btn--light"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main id="conteudo-admin" className="container admin__main" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout