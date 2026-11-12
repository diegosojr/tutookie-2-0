import { Routes, Route } from 'react-router'
import PublicLayout from './layouts/PublicLayout.jsx'
import HomePage from './pages/public/HomePage.jsx'
import CatalogPage from './pages/public/CatalogPage.jsx'
import ProductDetailPage from './pages/public/ProductDetailPage.jsx'
import PromotionsPage from './pages/public/PromotionsPage.jsx'
import LoginPage from './pages/public/LoginPage.jsx'
import NotFoundPage from './pages/public/NotFoundPage.jsx'

function App() {
  return (
    <Routes>
      {/* Todas as rotas públicas compartilham o mesmo cabeçalho e rodapé */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<CatalogPage />} />
        <Route path="/produto/:id" element={<ProductDetailPage />} />
        <Route path="/promocoes" element={<PromotionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App