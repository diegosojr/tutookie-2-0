import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

// Guarda de rotas. Todas as rotas dentro dela só aparecem para quem tem
// o perfil exigido em "requiredRole".
function ProtectedRoute({ requiredRole }) {
  const { user } = useAuth()
  const location = useLocation()

  // Não logado: vai para o login e volta para cá depois de entrar
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Logado, mas com perfil errado (ex.: cliente tentando abrir /admin)
  if (requiredRole && user.perfil !== requiredRole) {
    return <Navigate to="/acesso-negado" replace />
  }

  return <Outlet />
}

export default ProtectedRoute