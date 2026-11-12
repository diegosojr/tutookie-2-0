// Formata um número como preço em reais. Exemplo: 14 vira "R$ 14,00".
export function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}