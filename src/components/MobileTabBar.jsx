import { NavLink } from 'react-router'

function MobileTabBar() {
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
          <NavLink to="/login">Entrar</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default MobileTabBar