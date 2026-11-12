// AUTENTICAÇÃO SIMULADA (somente para demonstração acadêmica).
//
// ATENÇÃO: este login NÃO é seguro. As senhas ficam visíveis no código que
// roda no navegador. Em um sistema real, o login será feito por uma API
// (backend). As credenciais abaixo são FICTÍCIAS.

const SESSION_KEY = 'tutookie:session'
const FAKE_DELAY_MS = 500

// Entidade Usuário: id, nome, email e perfil ('admin' ou 'cliente').
const demoUsers = [
  {
    id: 'u1',
    nome: 'Administrador Demo',
    email: 'admin@tutookie.test',
    senha: 'admin123',
    perfil: 'admin',
  },
  {
    id: 'u2',
    nome: 'Cliente Demo',
    email: 'cliente@tutookie.test',
    senha: 'cliente123',
    perfil: 'cliente',
  },
]

// Credenciais exibidas na tela de login (claramente fictícias)
export const demoCredentials = demoUsers.map((user) => ({
  perfil: user.perfil,
  email: user.email,
  senha: user.senha,
}))

// Remove a senha antes de guardar ou compartilhar o usuário
function toPublicUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    perfil: user.perfil,
  }
}

// Recupera a sessão salva (para continuar logado ao atualizar a página).
export function getStoredUser() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY))
    const found = demoUsers.find((user) => user.id === saved?.id)
    return found ? toPublicUser(found) : null
  } catch {
    return null
  }
}

export async function login(email, password) {
  await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS))

  const found = demoUsers.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.senha === password,
  )

  if (!found) {
    throw new Error('E-mail ou senha incorretos.')
  }

  const publicUser = toPublicUser(found)
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser))
  return publicUser
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}