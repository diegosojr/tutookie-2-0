import { useEffect } from 'react'
import { useLocation } from 'react-router'

const SITE_NAME = 'Tutookie Cookies'

// Título da aba para cada rota. As rotas dinâmicas usam [^/]+ para
// aceitar qualquer id.
const TITLES = [
  { match: /^\/$/, title: 'Início' },
  { match: /^\/produtos$/, title: 'Produtos' },
  { match: /^\/produto\/[^/]+$/, title: 'Detalhes do produto' },
  { match: /^\/promocoes$/, title: 'Promoções' },
  { match: /^\/login$/, title: 'Entrar' },
  { match: /^\/acesso-negado$/, title: 'Acesso negado' },
  { match: /^\/admin$/, title: 'Dashboard · Admin' },
  { match: /^\/admin\/produtos$/, title: 'Produtos · Admin' },
  { match: /^\/admin\/produtos\/novo$/, title: 'Novo produto · Admin' },
  {
    match: /^\/admin\/produtos\/[^/]+\/editar$/,
    title: 'Editar produto · Admin',
  },
]

// Atualiza o título da aba sempre que a rota muda.
export function useRouteTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const found = TITLES.find((item) => item.match.test(pathname))
    document.title = found
      ? `${found.title} | ${SITE_NAME}`
      : `Página não encontrada | ${SITE_NAME}`
  }, [pathname])
}