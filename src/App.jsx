import { Routes, Route } from 'react-router'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import HomePage from './pages/public/HomePage.jsx'
import CatalogPage from './pages/public/CatalogPage.jsx'
import ProductDetailPage from './pages/public/ProductDetailPage.jsx'
import PromotionsPage from './pages/public/PromotionsPage.jsx'
import LoginPage from './pages/public/LoginPage.jsx'
import AccessDeniedPage from './pages/public/AccessDeniedPage.jsx'
import NotFoundPage from './pages/public/NotFoundPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx'
import AdminProductFormPage from './pages/admin/AdminProductFormPage.jsx'

function App() {
  return (
    <Routes>
      {/* Rotas públicas: compartilham cabeçalho e rodapé da loja */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produtos" element={<CatalogPage />} />
        <Route path="/produto/:id" element={<ProductDetailPage />} />
        <Route path="/promocoes" element={<PromotionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/acesso-negado" element={<AccessDeniedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Rotas administrativas: só para o perfil "admin" */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/produtos" element={<AdminProductsPage />} />
          <Route path="/admin/produtos/novo" element={<AdminProductFormPage />} />
          <Route
            path="/admin/produtos/:id/editar"
            element={<AdminProductFormPage />}
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default App