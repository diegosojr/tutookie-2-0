// REGRAS DE VALIDAÇÃO DO PRODUTO
// Usadas pelo formulário do painel administrativo.

export const TAGS = ['Novidade', 'Mais pedido', 'Destaque']

// Ordem em que os campos aparecem (o foco vai para o primeiro com erro)
export const FIELD_ORDER = [
  'nome',
  'descricao',
  'categoriaId',
  'preco',
  'precoPromocional',
  'etiqueta',
  'imagem',
]

// Converte o texto digitado em número.
// Retorna: null (campo vazio), NaN (texto inválido) ou o número.
// Aceita "14,50", "14.50", "R$ 14,50" e "1.234,50".
export function parsePrice(text) {
  const clean = String(text ?? '')
    .trim()
    .replace(/^R\$\s*/i, '')
    .replace(/\s/g, '')

  if (clean === '') return null
  if (clean.startsWith('-')) return -1 // negativo: cai na regra "maior que zero"

  const normalized = clean.includes(',')
    ? clean.replace(/\./g, '').replace(',', '.')
    : clean

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return Number.NaN
  return Number(normalized)
}

// Número para o texto do campo. Exemplo: 13.5 vira "13,50".
export function priceToInput(value) {
  if (value === null || value === undefined || value === '') return ''
  return Number(value).toFixed(2).replace('.', ',')
}

// Valida os valores do formulário e devolve um objeto de erros.
// Objeto vazio = formulário válido.
export function validateProduct(values, categoryIds) {
  const errors = {}

  const nome = values.nome.trim()
  if (!nome) {
    errors.nome = 'Informe o nome do produto.'
  } else if (nome.length < 3) {
    errors.nome = 'O nome deve ter pelo menos 3 caracteres.'
  } else if (nome.length > 80) {
    errors.nome = 'O nome deve ter no máximo 80 caracteres.'
  }

  const descricao = values.descricao.trim()
  if (!descricao) {
    errors.descricao = 'Informe a descrição do produto.'
  } else if (descricao.length < 10) {
    errors.descricao = 'A descrição deve ter pelo menos 10 caracteres.'
  } else if (descricao.length > 300) {
    errors.descricao = 'A descrição deve ter no máximo 300 caracteres.'
  }

  if (!values.categoriaId) {
    errors.categoriaId = 'Selecione uma categoria.'
  } else if (!categoryIds.includes(values.categoriaId)) {
    errors.categoriaId = 'Selecione uma categoria válida.'
  }

  const preco = parsePrice(values.preco)
  if (preco === null) {
    errors.preco = 'Informe o preço.'
  } else if (Number.isNaN(preco)) {
    errors.preco = 'Digite um preço válido, como 14,50.'
  } else if (preco <= 0) {
    errors.preco = 'O preço deve ser maior que zero.'
  } else if (preco > 9999.99) {
    errors.preco = 'O preço deve ser de no máximo R$ 9.999,99.'
  }

  const promo = parsePrice(values.precoPromocional)
  if (promo !== null) {
    if (Number.isNaN(promo)) {
      errors.precoPromocional =
        'Digite um preço promocional válido, como 12,00.'
    } else if (promo <= 0) {
      errors.precoPromocional =
        'O preço promocional deve ser maior que zero.'
    } else if (!errors.preco && promo >= preco) {
      errors.precoPromocional =
        'O preço promocional deve ser menor que o preço original.'
    }
  }

  if (values.etiqueta && !TAGS.includes(values.etiqueta)) {
    errors.etiqueta = 'Selecione uma etiqueta válida.'
  }

  return errors
}