import { Link, NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import BrandLogo from './BrandLogo.jsx'

function Header() {
  const { user } = useAuth()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Tutookie, página inicial">
          <BrandLogo />
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