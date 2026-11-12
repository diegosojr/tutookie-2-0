import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext.js'

// Atalho para acessar a autenticação em qualquer componente:
// const { user, login, logout } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.')
  }
  return context
}