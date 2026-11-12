// Regra de negócio: um produto está em promoção quando tem preço
// promocional válido (maior que zero) e MENOR que o preço original.
export function hasActivePromotion(product) {
  const promo = Number(product.precoPromocional)
  return promo > 0 && promo < Number(product.preco)
}

// Percentual de desconto arredondado. Exemplo: de 16 por 13,50 = 16%.
// Retorna 0 quando não há promoção ativa.
export function getDiscountPercent(product) {
  if (!hasActivePromotion(product)) return 0
  const ratio = Number(product.precoPromocional) / Number(product.preco)
  return Math.round((1 - ratio) * 100)
}