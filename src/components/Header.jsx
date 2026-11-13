import { NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

// Cabeçalho (somente tablet e computador): menu centralizado.
// No celular, o menu fica na barra inferior (MobileTabBar).
function Header() {
  const { user } = useAuth()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
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