import { NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

function MobileTabBar() {
  const { user } = useAuth()

  return (
    <nav className="tabbar" aria-label="Navegação inferior">
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
        <li>
          <NavLink to="/login">{user ? 'Conta' : 'Entrar'}</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default MobileTabBar