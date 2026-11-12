import { createContext } from 'react'

// A "caixa compartilhada" da autenticação.
// Quem preenche essa caixa é o AuthProvider.
export const AuthContext = createContext(null)