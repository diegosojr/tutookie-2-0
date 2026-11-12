import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import * as authService from '../services/authService.js'

// Envolve a aplicação e disponibiliza o usuário logado e as funções
// de login e logout para qualquer componente.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getStoredUser())

  const login = useCallback(async (email, password) => {
    const loggedUser = await authService.login(email, password)
    setUser(loggedUser)
    return loggedUser
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.perfil === 'admin',
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}