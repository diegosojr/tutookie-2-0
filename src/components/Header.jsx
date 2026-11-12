import { Link, NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

function Header() {
  const { user } = useAuth()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        {/* Espaço reservado: a logomarca original entrará aqui */}
        <Link to="/" className="brand" aria-label="Tutookie, página inicial">
          Tutookie
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          <ul>
            <li>
              <NavLink to="/" end>
                Início
              </NavLink>
            </li>
            <li>
              <NavLink to="/produtos">Produtos</NavLink>
            </li>
            <li>
              <NavLink to="/promocoes">Promoções</NavLink>
            </li>
            {user?.perfil === 'admin' && (
              <li>
                <NavLink to="/admin">Painel</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/login">{user ? 'Minha conta' : 'Entrar'}</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header