// AUTENTICAÇÃO SIMULADA (somente para demonstração acadêmica).
//
// ATENÇÃO: este login NÃO é seguro. As senhas ficam no código que roda no
// navegador e qualquer pessoa pode lê-las. Em um sistema real, o login será
// feito por uma API (backend). As credenciais abaixo são FICTÍCIAS.

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

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Remove a senha antes de guardar ou compartilhar o usuário
function toPublicUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    perfil: user.perfil,
  }
}

function saveSession(user) {
  const publicUser = toPublicUser(user)
  localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser))
  return publicUser
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

// Login com e-mail e senha.
export async function login(email, password) {
  await wait(FAKE_DELAY_MS)

  const found = demoUsers.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.senha === password,
  )

  if (!found) {
    throw new Error('E-mail ou senha incorretos.')
  }

  return saveSession(found)
}

// Acesso rápido como cliente de demonstração (sem senha).
export async function loginAsCustomer() {
  await wait(FAKE_DELAY_MS)

  const customer = demoUsers.find((user) => user.perfil === 'cliente')
  return saveSession(customer)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}