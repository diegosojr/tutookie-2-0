# Tutookie 2.0 — Plataforma de Catálogo e Gerenciamento de Produtos

Frontend da **Fase 1** do projeto da disciplina **Criar Serviços Web com REST**:
uma aplicação React com uma **loja virtual** para clientes e um **painel
administrativo** para gerenciar produtos e a identidade visual da loja, criada
para a marca **Tutookie Cookies** (Campina Grande — Paraíba).

> **Versão acadêmica (Fase 1).** Os dados são simulados e ficam no navegador.
> O backend com API REST e banco de dados está previsto para a Fase 2.
> Veja as [limitações](#limitações-da-versão-acadêmica).

## Sumário

1. [Identificação](#identificação)
2. [Início rápido](#início-rápido)
3. [Checklist da Fase 1](#checklist-da-fase-1)
4. [Definição da aplicação](#definição-da-aplicação)
5. [Mapa de rotas](#mapa-de-rotas)
6. [Modelagem de dados e regras de negócio](#modelagem-de-dados)
7. [Tecnologias e estrutura de pastas](#tecnologias)
8. [Wireframes](#wireframes)
9. [Validações dos formulários](#validações-dos-formulários)
10. [Estados de carregamento, erro e vazio](#estados-de-carregamento-erro-e-vazio)
11. [Acessibilidade e responsividade](#acessibilidade-e-responsividade)
12. [Identidade visual e configurações da loja](#identidade-visual-e-configurações-da-loja)
13. [Credenciais demonstrativas](#credenciais-demonstrativas-fictícias)
14. [Limitações da versão acadêmica](#limitações-da-versão-acadêmica)
15. [Preparação para API REST](#preparação-para-integração-futura-com-api-rest)
16. [Próximos passos (Fase 2)](#próximos-passos-fase-2)
17. [Roteiro de verificação](#roteiro-de-verificação-passo-a-passo)
18. [Histórico do desenvolvimento](#histórico-do-desenvolvimento)

## Identificação

| | |
|---|---|
| **Nome completo** | [DIEGO SILVA OLIVEIRA JÚNIOR] |
| **E-mail** | [diego.junior@mais unifacisa.com.br] |
| **Responsabilidade** | Desenvolvimento individual (todos os commits são do próprio estudante) |
| **Repositório** | [https://github.com/diegosojr/tutookie-2-0.git] |

## Início rápido

**Requisitos:** [Node.js](https://nodejs.org) 20.19 ou superior (versão LTS
recomendada) e Git.

```bash
git clone [LINK-DO-REPOSITORIO].git
cd tutookie-2-0
npm install
npm run dev
```

Abra o endereço exibido no terminal (normalmente `http://localhost:5173`).

**Para entrar como administrador:** abra `/login` e digite
`admin@tutookie.test` / `admin123` (credenciais fictícias).
**Para entrar como cliente:** na mesma tela, clique em **Entrar como cliente**.

Outros comandos:

```bash
npm run build     # gera a versão de produção
npm run preview   # visualiza a versão de produção
npm run lint      # verifica a qualidade do código
```

## Checklist da Fase 1

| # | Requisito da professora | Onde está / como verificar |
|---|---|---|
| 1 | Projeto React com Vite funcionando sem erros | `npm install` e `npm run dev`; também passam `npm run lint` e `npm run build` |
| 2 | Pelo menos 5 rotas, com rota dinâmica e 404 | [Mapa de rotas](#mapa-de-rotas): 11 rotas, 2 dinâmicas (`/produto/:id` e `/admin/produtos/:id/editar`) e a página 404 (`*`) |
| 3 | Login com Context API, diferenciando administrador e usuário comum | `AuthProvider` + `ProtectedRoute`. Cliente em `/admin` vai para "Acesso negado" |
| 4 | Listagem de produtos com filtros e paginação | `/produtos` (busca, categoria, promoções, 8 por página) e `/admin/produtos` (6 por página) |
| 5 | Formulários com validação e mensagens claras | Login e cadastro/edição de produto: [validações](#validações-dos-formulários) |
| 6 | Estados de carregamento, erro e lista vazia | [Tabela de estados](#estados-de-carregamento-erro-e-vazio); botões de simulação no Dashboard do admin |
| 7 | CSS responsivo e acessível, com navegação por teclado | [Acessibilidade e responsividade](#acessibilidade-e-responsividade) |
| 8 | Repositório Git com histórico de commits | Aba **Commits** do GitHub |

## Definição da aplicação

**Nome do sistema:** Tutookie 2.0 — Plataforma de Catálogo e Gerenciamento de Produtos.

**Problema que resolve:** a Tutookie, uma marca de cookies artesanais, precisa
apresentar seus produtos de forma moderna e manter o catálogo e a identidade
visual atualizados **sem depender de alterações no código**. O sistema separa a
vitrine (clientes) da área de gestão (administrador).

**Público-alvo:**
- Clientes que querem conhecer os sabores, buscar produtos e ver promoções.
- O administrador (dono da loja), que cadastra produtos e configura a loja.

**Contexto de utilização:** acesso principalmente por celular (redes sociais e
compartilhamento de links), mas também por computador e tablet.

**Objetivos e funcionalidades**

Loja (pública):
- Página inicial com banner, apresentação e produtos em destaque.
- Barra de categorias em todas as páginas da loja.
- Catálogo com busca por texto, filtro por categoria, filtro de promoções e paginação.
- Página individual do produto, com preço, desconto e disponibilidade.
- Página de promoções.
- Login para cliente e administrador.

Painel administrativo (somente perfil `admin`):
- Dashboard com indicadores calculados a partir dos dados cadastrados.
- Listagem de produtos com filtros e paginação.
- Cadastro e edição de produtos, com validação e envio de imagem.
- Exclusão com confirmação.
- Configurações da loja: envio de logomarca, banner e ícone da aba.
- Ferramentas para demonstrar os estados de erro e de lista vazia.

## Mapa de rotas

| Rota | Página | Acesso |
|---|---|---|
| `/` | Página inicial | Pública |
| `/produtos` | Catálogo (busca, filtros e paginação) | Pública |
| `/produto/:id` | Detalhes do produto (**rota dinâmica**) | Pública |
| `/promocoes` | Promoções | Pública |
| `/login` | Login e conta | Pública |
| `/acesso-negado` | Aviso de acesso negado | Pública |
| `/admin` | Dashboard | Somente `admin` |
| `/admin/produtos` | Gerenciamento de produtos | Somente `admin` |
| `/admin/produtos/novo` | Cadastro de produto | Somente `admin` |
| `/admin/produtos/:id/editar` | Edição de produto (**rota dinâmica**) | Somente `admin` |
| `/admin/configuracoes` | Configurações da loja (logomarca, banner e ícone) | Somente `admin` |
| `*` | Página 404 | Pública |

Os filtros do catálogo ficam na URL: `/produtos?q=texto&categoria=id&promo=1&pagina=2`.

## Modelagem de dados

### Produto

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | texto | Identificador único |
| `nome` | texto | Nome do produto |
| `descricao` | texto | Descrição do produto |
| `preco` | número | Preço original (R$) |
| `precoPromocional` | número ou `null` | Preço com desconto, quando existir |
| `imagem` | texto | Imagem do produto (vazio = sem imagem) |
| `categoriaId` | texto | Categoria do produto (chave estrangeira) |
| `etiqueta` | texto | `Novidade`, `Mais pedido`, `Destaque` ou vazio |
| `disponivel` | booleano | Disponibilidade para venda |

### Categoria

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | texto | Identificador único |
| `nome` | texto | Nome da categoria |
| `descricao` | texto | Descrição da categoria |

### Usuário

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | texto | Identificador único |
| `nome` | texto | Nome do usuário |
| `email` | texto | E-mail de acesso |
| `perfil` | texto | `admin` ou `cliente` (perfil de acesso) |

### Relacionamento

```text
Categoria 1 ────────< N Produto
(uma categoria contém vários produtos; cada produto pertence a uma categoria)
```

### Regras de negócio

1. **Preço válido:** o preço deve ser maior que zero (e de no máximo R$ 9.999,99).
2. **Categoria obrigatória:** todo produto pertence a uma categoria existente.
3. **Promoção válida:** o preço promocional, se informado, deve ser maior que zero
   e **menor** que o preço original. Caso contrário, o produto não é considerado
   em promoção.
4. **Desconto:** o percentual é calculado automaticamente
   (`(1 − preço promocional ÷ preço) × 100`, arredondado).
5. **Promoções (página):** listam apenas produtos disponíveis com promoção válida.
6. **Destaques (página inicial):** até 4 produtos disponíveis que tenham etiqueta.
7. **Permissões:** somente o perfil `admin` acessa `/admin` e suas subrotas. Um
   cliente autenticado é redirecionado para `/acesso-negado`; quem não está
   autenticado é redirecionado para `/login`.
8. **Exclusão:** exige confirmação do administrador.

## Tecnologias

- **React** e **Vite** (JavaScript).
- **React Router** (`react-router`): rotas, rota dinâmica, rotas aninhadas com
  layouts e proteção por perfil.
- **Context API**: autenticação e perfil do usuário.
- **CSS tradicional** responsivo, com variáveis (tokens de design) e abordagem
  *mobile first*.
- **Fontsource**: fontes Fraunces (títulos) e DM Sans (textos) hospedadas no projeto.
- **ESLint**: verificação de qualidade do código.
- **Git e GitHub**: controle de versão.

As versões exatas estão no arquivo `package.json`.

### Estrutura de pastas

```text
tutookie-2-0/
├── public/
│   └── images/         logo.png, banner.jpg, mascote.png (imagens padrão da marca)
├── src/
│   ├── components/     Header, CategoryNav, HeroBanner, Footer, MobileTabBar,
│   │                   ProductCard, ProductForm, Pagination, StatusMessage,
│   │                   ConfirmDialog
│   ├── contexts/       AuthContext, AuthProvider
│   ├── data/           categories.js, products.js (dados simulados iniciais)
│   ├── hooks/          useAuth, useAsyncData, useRouteTitle, useFavicon
│   ├── layouts/        PublicLayout, AdminLayout
│   ├── pages/
│   │   ├── public/     Home, Catalog, ProductDetail, Promotions, Login,
│   │   │               AccessDenied, NotFound
│   │   └── admin/      Dashboard, Products, ProductForm, Settings
│   ├── routes/         ProtectedRoute
│   ├── services/       productService, authService, settingsService
│   ├── styles/         tokens, base, layout, components, forms, home, catalog,
│   │                   product, auth, admin, product-form, store, category-nav
│   ├── utils/          format, text, product, productValidation, image
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## Wireframes

**Página inicial (computador)**

```text
┌──────────────────────────────────────────────────────────────┐
│           Início    Produtos    Promoções    Entrar          │
├──────────────────────────────────────────────────────────────┤
│  [Todos] [Cookies Premium] [Tradicional] [Mini Torta] [...]  │
│                                                              │
│       ╭──────────────────────────────────────────────╮       │
│       │                                              │       │
│       │        Banner da loja (centralizado,         │       │
│       │        bordas arredondadas)                  │       │
│       ╰──────────────────────────────────────────────╯       │
│                                                              │
│                  CAMPINA GRANDE — PARAÍBA                    │
│                    Cookies artesanais                        │
│             [Ver produtos]  [Ver promoções]                  │
│                                                              │
│  Destaques                                      Ver todos    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                 │
│  │ foto   │ │ foto   │ │ foto   │ │ foto   │                 │
│  │etiqueta│ │etiqueta│ │etiqueta│ │etiqueta│                 │
│  │ nome   │ │ nome   │ │ nome   │ │ nome   │                 │
│  │ R$     │ │ R$     │ │ R$     │ │ R$     │                 │
│  └────────┘ └────────┘ └────────┘ └────────┘                 │
├──────────────────────────────────────────────────────────────┤
│ Rodapé (marrom): logomarca · Campina Grande — PB             │
└──────────────────────────────────────────────────────────────┘
```

**Página inicial (celular)**

```text
┌──────────────────┐
│ [Todos][Premium] │ ← categorias (rolam para o lado)
│ ╭──────────────╮ │
│ │   Banner     │ │
│ ╰──────────────╯ │
│ CAMPINA GRANDE   │
│ Cookies          │
│ artesanais       │
│ [Produtos][Promo]│
│ Destaques        │
│ ┌──────────────┐ │
│ │ card         │ │
│ └──────────────┘ │
├──────────────────┤
│Início Prod Promo │ ← barra fixa
│          Entrar  │   inferior
└──────────────────┘
```

**Catálogo**

```text
┌──────────────────────────────────────────────────────────────┐
│ Produtos                                                     │
│ ┌ Buscar ────────┐ ┌ Categoria ▾┐ ☐ Somente promoções [Limpar]│
│ └────────────────┘ └────────────┘                            │
│ 14 produtos encontrados — página 1 de 2                      │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│ │ card   │ │ card   │ │ card   │ │ card   │   (8 por página) │
│ └────────┘ └────────┘ └────────┘ └────────┘                  │
│        [Anterior]   ( 1 ) ( 2 )   [Próxima]                  │
└──────────────────────────────────────────────────────────────┘
```

**Detalhe do produto**

```text
┌──────────────────────────────────────────────────────────────┐
│ ┌──────────────────┐   CATEGORIA                             │
│ │                  │   [Etiqueta]                            │
│ │      Foto        │   Nome do produto                       │
│ │                  │   R$ 13,50  ~~R$ 16,00~~  16% desconto  │
│ └──────────────────┘   Disponível                            │
│                        Descrição                             │
│                        [Voltar ao catálogo]                  │
└──────────────────────────────────────────────────────────────┘
```

**Login**

```text
┌────────────────────────────┐
│       Faça seu login       │
│ E-mail  [________________] │
│ Senha   [________________] │
│ [          Entrar        ] │
│ ───────────── ou ───────── │
│ [  Entrar como cliente   ] │
└────────────────────────────┘
```

**Painel administrativo — lista de produtos**

```text
┌──────────────────────────────────────────────────────────────┐
│ Tutookie · Painel  Dashboard Produtos Configurações [Sair]   │
├──────────────────────────────────────────────────────────────┤
│ Produtos                                      [Novo produto] │
│ [Buscar] [Categoria ▾] [Disponibilidade ▾]    [Limpar]       │
│ ┌──────┬──────┬───────────┬───────┬───────┬──────┬─────────┐ │
│ │Imagem│ Nome │ Categoria │ Preço │ Promo │ Disp.│ Ações   │ │
│ ├──────┼──────┼───────────┼───────┼───────┼──────┼─────────┤ │
│ │ [ ]  │ ...  │ ...       │ R$    │ R$    │ Sim  │Editar   │ │
│ │      │      │           │       │       │      │Excluir  │ │
│ └──────┴──────┴───────────┴───────┴───────┴──────┴─────────┘ │
│          [Anterior]  ( 1 ) ( 2 ) ( 3 )  [Próxima]            │
└──────────────────────────────────────────────────────────────┘
```

**Painel administrativo — formulário de produto**

```text
┌────────────────────────────────────────────┐
│ Novo produto                               │
│ Nome *            [______________________] │
│ Descrição *       [______________________] │
│ Categoria *       [Selecione ▾]            │
│ Preço *   [_____]   Preço promocional [___]│
│ Etiqueta          [Sem etiqueta ▾]         │
│ Imagem            [Escolher arquivo]       │
│                   (pré-visualização)       │
│ ☑ Produto disponível para venda            │
│ [Cadastrar produto]  [Cancelar]            │
└────────────────────────────────────────────┘
```

**Painel administrativo — configurações da loja**

```text
┌────────────────────────────────────────────┐
│ Configurações da loja                      │
│ ┌ Logomarca ─────────────────────────────┐ │
│ │ (pré-visualização)  [Escolher imagem]  │ │
│ └────────────────────────────────────────┘ │
│ ┌ Banner da página inicial ──────────────┐ │
│ └────────────────────────────────────────┘ │
│ ┌ Ícone da aba do navegador ─────────────┐ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

## Validações dos formulários

**Login**

| Campo | Regras | Mensagens |
|---|---|---|
| E-mail | Obrigatório; formato válido | "Informe seu e-mail." / "Digite um e-mail válido, como nome@exemplo.com." |
| Senha | Obrigatória; mínimo de 6 caracteres | "Informe sua senha." / "A senha deve ter pelo menos 6 caracteres." |
| Credenciais | Devem corresponder a um usuário de demonstração | "E-mail ou senha incorretos." |

**Produto (cadastro e edição)**

| Campo | Regras | Exemplo de mensagem |
|---|---|---|
| Nome | Obrigatório; 3 a 80 caracteres | "Informe o nome do produto." |
| Descrição | Obrigatória; 10 a 300 caracteres | "A descrição deve ter pelo menos 10 caracteres." |
| Categoria | Obrigatória; deve existir | "Selecione uma categoria." |
| Preço | Obrigatório; número válido; maior que zero; até R$ 9.999,99 | "O preço deve ser maior que zero." |
| Preço promocional | Opcional; válido; maior que zero; menor que o preço | "O preço promocional deve ser menor que o preço original." |
| Etiqueta | Opcional; valor da lista | "Selecione uma etiqueta válida." |
| Imagem | Opcional; JPG, PNG ou WebP; até 5 MB | "Formato não aceito. Envie uma imagem JPG, PNG ou WebP." |

Em todos os formulários, os erros aparecem abaixo do campo, são ligados ao campo
por `aria-describedby`, e o foco do teclado vai para o primeiro campo com problema.

## Estados de carregamento, erro e vazio

| Tela | Carregando | Erro | Vazio |
|---|---|---|---|
| Início | "Carregando produtos..." | Mensagem + **Tentar novamente** | "Nenhum destaque no momento" |
| Catálogo | "Carregando produtos..." | "Não foi possível carregar o catálogo" + **Tentar novamente** | "Ainda não há produtos cadastrados" e "Nenhum produto encontrado" (com **Limpar filtros**) |
| Produto | "Carregando produto..." | Mensagem + **Tentar novamente** | "Produto não encontrado" |
| Promoções | "Carregando promoções..." | Mensagem + **Tentar novamente** | "Nenhuma promoção ativa no momento" |
| Admin (Dashboard, Produtos, Formulário) | Carregando em cada tela | Mensagem + **Tentar novamente** | "Nenhum produto cadastrado" |

O carregamento é demonstrado por um atraso simulado de cerca de 0,6 segundo.

**Como demonstrar erro e lista vazia:** entre como administrador, abra o
**Dashboard** (`/admin`) e marque as caixas de **Ferramentas de demonstração**
("Simular erro de carregamento" e "Simular lista de produtos vazia"). Depois
recarregue a página ou navegue até a tela desejada. Desmarque as caixas para
voltar ao normal.

## Acessibilidade e responsividade

- HTML semântico (`header`, `nav`, `main`, `footer`, `article`, tabelas com `scope`).
- Navegação completa por teclado (**Tab**, **Shift + Tab**, **Enter**, **Espaço**,
  **Esc**), com foco visível e link "Pular para o conteúdo".
- Rótulos (`label`) em todos os campos; mensagens de erro ligadas aos campos.
- Diálogo de confirmação nativo (`<dialog>`), com foco preso e fechamento por `Esc`.
- Textos alternativos nas imagens; espaço reservado acessível quando não há imagem.
- Cores com contraste adequado; respeito à preferência por menos animação.
- Título da aba atualizado em cada rota; idioma `pt-BR`.
- Layout *mobile first*: barra de navegação fixa na parte inferior no celular e
  menu centralizado no topo em tablets e computadores; a barra de categorias
  rola para o lado nas telas estreitas; a tabela do admin rola dentro da própria caixa.

## Identidade visual e configurações da loja

- **Imagens padrão** (já incluídas no repositório, em `public/images`):
  `logo.png` (logomarca), `banner.jpg` (banner da página inicial) e
  `mascote.png` (ícone da aba do navegador). Quem baixar o projeto já vê a
  identidade da marca.
- **Painel admin → Configurações** (`/admin/configuracoes`): permite enviar uma
  nova logomarca, banner ou ícone **sem alterar o código**. As imagens enviadas
  são reduzidas e comprimidas automaticamente e têm prioridade sobre as padrão.
  O botão **Voltar à imagem padrão** desfaz o envio.
- **Imagens de produto**: enviadas no formulário de produto e reduzidas
  (máximo de 1000 px, JPG comprimido) antes de serem salvas.
- Paleta: laranja `#C87938`, marrom chocolate `#48301C`, creme `#FFF8F0`,
  cinza muito claro `#F2F3F5` e texto `#24252B`. Variações escuras são usadas
  em textos para garantir contraste.

## Credenciais demonstrativas (FICTÍCIAS)

Estas contas existem **apenas para a demonstração acadêmica** e estão no código
do frontend. Não representam usuários reais.

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@tutookie.test` | `admin123` |
| Cliente | `cliente@tutookie.test` | `cliente123` |

Na tela de login, digite as credenciais do administrador no formulário. O botão
**Entrar como cliente** acessa a conta de cliente de demonstração, sem senha.

## Limitações da versão acadêmica

- **Não há backend nem banco de dados.** Os dados são simulados e persistidos no
  `localStorage` do navegador. Eles **não são compartilhados** entre dispositivos
  ou navegadores e **não são um banco de dados real**.
- **O login é simulado e não é seguro**: as credenciais ficam no código do
  frontend e podem ser lidas por qualquer pessoa. Não deve ser usado em produção.
- **Imagens enviadas pelo painel** ficam no `localStorage` (limite aproximado de
  5 MB) e só aparecem no navegador onde foram enviadas. As imagens padrão
  (pasta `public/images`) aparecem para todos.
- Alterações de produtos feitas no painel também valem **somente no navegador
  em que foram feitas**. Quem abrir o projeto pela primeira vez vê os 14
  produtos de exemplo (nomes e preços **fictícios**).
- Para restaurar os dados de exemplo: abra as ferramentas do navegador (`F12`),
  aba **Console**, execute `localStorage.clear()` e recarregue a página.
- **Não há carrinho, cadastro de clientes, pedidos, pagamento ou cálculo de
  entrega** nesta fase.
- Gerenciamento de categorias e personalização de cores pelo painel não foram
  implementados.

## Preparação para integração futura com API REST

Todo acesso a dados está concentrado em `src/services/`. As páginas só chamam
essas funções, que já são assíncronas (retornam promessas), como em uma API real.
Para integrar o backend, basta trocar o interior de cada função por chamadas
`fetch`, sem alterar as páginas. Mapeamento proposto:

| Função do serviço | Endpoint REST previsto |
|---|---|
| `listProducts()` | `GET /produtos` |
| `getProductById(id)` | `GET /produtos/:id` |
| `createProduct(data)` | `POST /produtos` |
| `updateProduct(id, data)` | `PUT /produtos/:id` |
| `deleteProduct(id)` | `DELETE /produtos/:id` |
| `listCategories()` | `GET /categorias` |
| `login(email, senha)` | `POST /auth/login` |
| `getSettings()` / `saveSettings()` | `GET /configuracoes` / `PUT /configuracoes` |

Em uma versão com backend:
- o login usará um token de sessão e as senhas serão verificadas (e guardadas
  com hash) no servidor;
- as imagens serão enviadas ao servidor, e não ao navegador;
- regras de negócio e permissões também serão validadas no servidor;
- o estado de erro será alimentado por falhas reais de rede e de API.

## Próximos passos (Fase 2)

- API REST com banco de dados (produtos, categorias, usuários e configurações).
- Cadastro de clientes com contas reais e senhas protegidas.
- Carrinho de compras, endereço de entrega (com busca por CEP) e taxas de
  entrega configuráveis pelo painel.
- Pedidos recebidos no painel administrativo.
- Integração com meio de pagamento.
- Gerenciamento de categorias e carrossel de banners pelo painel.

## Roteiro de verificação passo a passo

Siga a ordem abaixo para conferir todos os itens da Fase 1.

1. **Execução:** `npm install` e `npm run dev`. Abra o endereço mostrado no terminal.
2. **Navegação e rotas:** use o menu (Início, Produtos, Promoções, Entrar) e a
   barra de categorias.
3. **Rota dinâmica:** em `/produtos`, clique em um card (abre `/produto/ID`);
   troque o ID na barra de endereço por um que não exista (ex.: `/produto/999`)
   para ver "Produto não encontrado".
4. **Página 404:** acesse `/qualquercoisa`.
5. **Busca e filtros:** em `/produtos`, busque por `torta`, escolha uma categoria
   e marque **Somente promoções**.
6. **Paginação:** em `/produtos` sem filtros, vá para a página 2 (o endereço
   ganha `?pagina=2`).
7. **Login com validação:** em `/login`, clique em **Entrar** com os campos
   vazios e depois com dados inválidos (e-mail `abc`, senha `123`).
8. **Cliente:** clique em **Entrar como cliente** e tente abrir `/admin`
   (aparece "Acesso negado"). Clique em **Minha conta** > **Sair**.
9. **Administrador:** entre com `admin@tutookie.test` / `admin123`. O painel
   abre em `/admin`.
10. **Cadastro com validação:** em **Produtos** > **Novo produto**, envie o
    formulário vazio e depois com preço `0` ou `abc`; teste preço promocional
    maior que o preço. Em seguida, cadastre um produto válido.
11. **Edição e exclusão:** edite o produto criado e exclua-o (o sistema pede confirmação).
12. **Estados de erro e vazio:** no **Dashboard**, use as caixas de **Ferramentas
    de demonstração** e recarregue a página; observe os estados de carregamento
    (ao abrir qualquer tela) e de erro/vazio.
13. **Configurações da loja:** em **Configurações**, envie uma imagem de banner e
    veja o resultado na página inicial; use **Voltar à imagem padrão**.
14. **Responsividade:** reduza a janela (ou use `F12` e `Ctrl + Shift + M`) e
    observe a barra de navegação inferior, a barra de categorias com rolagem e
    o layout em colunas.
15. **Teclado:** use **Tab** e **Shift + Tab** em todas as telas; **Enter** e
    **Espaço** para acionar elementos; **Esc** para fechar o diálogo de exclusão.
16. **Histórico:** na aba **Commits** do GitHub, confira os commits de todo o
    desenvolvimento.

## Histórico do desenvolvimento

O projeto foi desenvolvido em etapas, com um commit a cada marco concluído:
ambiente e projeto Vite, rotas, identidade visual base, dados simulados e
serviços, página inicial, catálogo com filtros e paginação, página de produto e
promoções, login com Context API e rotas protegidas, painel administrativo
(dashboard e tabela), formulários com validação e upload de imagem,
acessibilidade, configurações da loja (logomarca, banner e ícone), barra de
categorias e redesenho do topo da loja. O histórico completo está na aba
**Commits** do repositório.