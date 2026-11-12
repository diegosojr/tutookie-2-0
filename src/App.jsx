import { Routes, Route, NavLink } from 'react-router'
import HomePage from './pages/public/HomePage.jsx'
import CatalogPage from './pages/public/CatalogPage.jsx'
import ProductDetailPage from './pages/public/ProductDetailPage.jsx'
import PromotionsPage from './pages/public/PromotionsPage.jsx'
import LoginPage from './pages/public/LoginPage.jsx'
import NotFoundPage from './pages/public/NotFoundPage.jsx'

function App() {
  return (
    <>
      <nav aria-label="Navegação principal (provisória)">
        <NavLink to="/">Início</NavLink>
        <NavLink to="/produtos">Produtos</NavLink>
        <NavLink to="/produto/1">Produto 1 (exemplo)</NavLink>
        <NavLink to="/promocoes">Promoções</NavLink>
        <NavLink to="/login">Entrar</NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produtos" element={<CatalogPage />} />
          <Route path="/produto/:id" element={<ProductDetailPage />} />
          <Route path="/promocoes" element={<PromotionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App